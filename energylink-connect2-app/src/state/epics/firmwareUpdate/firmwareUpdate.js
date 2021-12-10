import { path, pick, propOr } from 'ramda'
import { ofType } from 'redux-observable'
import { concat, from, of, timer, EMPTY } from 'rxjs'
import {
  catchError,
  exhaustMap,
  map,
  retryWhen,
  take,
  takeUntil
} from 'rxjs/operators'
import * as Sentry from 'sentry-cordova'

import { getApiPVS } from 'shared/api'
import { translate } from 'shared/i18n'
import { sendCommandToPVS } from 'shared/PVSUtils'
import genericRetryStrategy from 'shared/rxjs/genericRetryStrategy'
import {
  getPVSVersionNumber,
  storagePresent,
  TAGS,
  waitFor,
  SECONDS_TO_WAIT_FOR_PVS_TO_REBOOT,
  stagesFromThePvs
} from 'shared/utils'
import {
  getFirmwareUpgradePackageURL,
  startWebserver,
  stopWebserver
} from 'shared/webserver'
import {
  UPDATE_DEVICES_LIST,
  UPDATE_DEVICES_LIST_ERROR
} from 'state/actions/devices'
import {
  SHOW_FIRMWARE_UPDATE_MODAL,
  FIRMWARE_UPDATE_COMPLETE,
  FIRMWARE_UPDATE_ERROR,
  INIT_FIRMWARE_UPDATE,
  START_FIRMWARE_UPDATE_POLLING,
  STOP_FIRMWARE_UPDATE_POLLING,
  POLL_FIRMWARE_UPDATE,
  WAIT_FOR_NETWORK_AFTER_FIRMWARE_UPDATE
} from 'state/actions/firmwareUpdate'
import { SHOW_MODAL } from 'state/actions/modal'
import {
  PVS_CONNECTION_INIT_AFTER_REBOOT,
  PVS_CONNECTION_SUCCESS_AFTER_REBOOT,
  STOP_NETWORK_POLLING,
  SET_CONNECTION_STATUS
} from 'state/actions/network'
import { appConnectionStatus } from 'state/reducers/network'

const getFirmwareFromState = path([
  'value',
  'firmwareUpdate',
  'versionBeforeUpgrade'
])

async function uploadFirmwareToAdama() {
  await startWebserver()
  const fileUrl = await getFirmwareUpgradePackageURL()
  return await sendCommandToPVS(`StartFWUpgrade&url=${fileUrl}`)
}

export const firmwareShowModal = action$ => {
  const t = translate()
  return action$.pipe(
    ofType(SHOW_FIRMWARE_UPDATE_MODAL.getType()),
    map(({ payload }) =>
      SHOW_MODAL({
        title: t('ATTENTION'),
        componentPath: './FirmwareUpdate.jsx',
        componentProps: payload
      })
    )
  )
}

/**
 * Upload PVS FW file to the PVS
 * @param action$
 * @returns {*}
 */
export const firmwareUpgradeInit = action$ =>
  action$.pipe(
    ofType(INIT_FIRMWARE_UPDATE.getType()),
    exhaustMap(() =>
      from(uploadFirmwareToAdama()).pipe(
        map(() => START_FIRMWARE_UPDATE_POLLING()),
        catchError(error => of(FIRMWARE_UPDATE_ERROR.asError(error)))
      )
    )
  )

export const firmwarePollStatus = action$ => {
  const stopPolling$ = action$.pipe(
    ofType(
      STOP_FIRMWARE_UPDATE_POLLING.getType(),
      FIRMWARE_UPDATE_ERROR.getType()
    )
  )
  return action$.pipe(
    ofType(START_FIRMWARE_UPDATE_POLLING.getType()),
    exhaustMap(() =>
      timer(0, 1500).pipe(
        takeUntil(stopPolling$),
        exhaustMap(() => from(sendCommandToPVS('GetFWUpgradeStatus'))),
        map(status =>
          propOr('complete', 'STATE', status) === 'complete'
            ? STOP_FIRMWARE_UPDATE_POLLING()
            : POLL_FIRMWARE_UPDATE(pick(['STATE', 'PERCENT'], status))
        ),
        retryWhen(
          genericRetryStrategy({
            maxRetryAttempts: 90,
            shouldScaleTime: false
          })
        ),
        catchError(err => {
          const message = err.message
          err.message = 'Polling update error'
          Sentry.addBreadcrumb({ message })
          Sentry.captureException(err)
          return of(STOP_FIRMWARE_UPDATE_POLLING())
        })
      )
    )
  )
}

const firmwareWaitForWifi = (action$, state$) =>
  action$.pipe(
    ofType(
      STOP_FIRMWARE_UPDATE_POLLING.getType(),
      SET_CONNECTION_STATUS.getType()
    ),
    exhaustMap(({ payload }) => {
      if (
        state$.value.firmwareUpdate.status === stagesFromThePvs[3] &&
        (payload === appConnectionStatus.NOT_CONNECTED_PVS ||
          payload === appConnectionStatus.NOT_USING_WIFI)
      ) {
        return concat(
          of(STOP_NETWORK_POLLING()),
          of(WAIT_FOR_NETWORK_AFTER_FIRMWARE_UPDATE()),
          from(waitFor(1000 * SECONDS_TO_WAIT_FOR_PVS_TO_REBOOT)).pipe(
            map(() =>
              PVS_CONNECTION_INIT_AFTER_REBOOT({
                ssid: state$.value.network.SSID,
                password: state$.value.network.password
              })
            )
          )
        )
      }

      return EMPTY
    })
  )

async function didThePVSUpgrade(lastVersion) {
  const PVSinfo = await sendCommandToPVS('GetSupervisorInformation')
  const PVSversion = getPVSVersionNumber(PVSinfo)
  if (PVSversion > lastVersion) return true
  throw new Error('FIRMWARE_UPDATE_ERROR')
}

const firmwareUpdateSuccessEpic = (action$, state$) => {
  const t = translate(state$.value.language)
  return action$.pipe(
    ofType(WAIT_FOR_NETWORK_AFTER_FIRMWARE_UPDATE.getType()),
    exhaustMap(() =>
      action$.pipe(
        ofType(PVS_CONNECTION_SUCCESS_AFTER_REBOOT.getType()),
        take(1),
        exhaustMap(() => {
          stopWebserver()
          const firmware = getFirmwareFromState(state$)
          return from(didThePVSUpgrade(firmware)).pipe(
            map(FIRMWARE_UPDATE_COMPLETE),
            catchError(err => {
              Sentry.captureException(err)
              return of(FIRMWARE_UPDATE_ERROR(t(err.message)))
            })
          )
        })
      )
    )
  )
}

const forceStorageAfterPVSFWUPEpic = (action$, state$) =>
  action$.pipe(
    ofType(FIRMWARE_UPDATE_COMPLETE.getType()),
    exhaustMap(() => {
      const promise = getApiPVS()
        .then(path(['apis', 'devices']))
        .then(api =>
          api.getDevices({
            detailed: false
          })
        )

      return from(promise).pipe(
        map(response => {
          const deviceList = path(['body', 'devices'], response)
          return storagePresent(deviceList)
            ? SHOW_MODAL({
                componentPath: './ForceStorageAfterPVSFWUP.jsx'
              })
            : UPDATE_DEVICES_LIST(path(['body', 'devices'], response))
        }),
        catchError(err => {
          Sentry.setTag(TAGS.KEY.ENDPOINT, TAGS.VALUE.DEVICES_GET_DEVICES)
          Sentry.captureMessage(`${err.message} - fetchDevicesList.js`)
          Sentry.captureException(err)
          return of(UPDATE_DEVICES_LIST_ERROR(err))
        })
      )
    })
  )

export default [
  firmwareUpgradeInit,
  firmwarePollStatus,
  firmwareWaitForWifi,
  firmwareUpdateSuccessEpic,
  firmwareShowModal,
  forceStorageAfterPVSFWUPEpic
]
