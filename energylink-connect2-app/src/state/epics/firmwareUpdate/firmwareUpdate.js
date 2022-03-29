import { includes, path, pick } from 'ramda'
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
  isPvs5,
  SECONDS_TO_WAIT_FOR_PVS_TO_REBOOT,
  storagePresent,
  TAGS,
  waitFor
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
  PVS_CONNECTION_SUCCESS,
  STOP_NETWORK_POLLING,
  SET_CONNECTION_STATUS
} from 'state/actions/network'
import { appConnectionStatus } from 'state/reducers/network'

const getFirmwareFromState = path([
  'value',
  'firmwareUpdate',
  'versionBeforeUpgrade'
])

async function uploadFirmwareToAdama(isPvs5) {
  await stopWebserver()
  await startWebserver()
  const fileUrl = await getFirmwareUpgradePackageURL(isPvs5)
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
export const firmwareUpgradeInit = (action$, state$) =>
  action$.pipe(
    ofType(INIT_FIRMWARE_UPDATE.getType()),
    exhaustMap(() =>
      from(uploadFirmwareToAdama(isPvs5(state$))).pipe(
        map(() => START_FIRMWARE_UPDATE_POLLING()),
        catchError(error => of(FIRMWARE_UPDATE_ERROR.asError(error)))
      )
    )
  )

const aboutToFinishFwupPvsDisconnection =
  'DISCONNECTED_FROM_PVS_WHEN_ABOUT_TO_FINISH_FWUP'

export const firmwarePollStatus = (action$, state$) => {
  const stopPolling$ = action$.pipe(
    ofType(
      FIRMWARE_UPDATE_COMPLETE.getType(),
      STOP_FIRMWARE_UPDATE_POLLING.getType(),
      FIRMWARE_UPDATE_ERROR.getType()
    )
  )

  return action$.pipe(
    ofType(START_FIRMWARE_UPDATE_POLLING.getType()),
    exhaustMap(() => {
      const { lastSuccessfulStage } = state$.value.firmwareUpdate
      const { model } = state$.value.pvs
      const aboutToFinishPvs5Fwup =
        isPvs5(model) && includes(lastSuccessfulStage, [1, 2])
      const aboutToFinishPvs6Fwup =
        !isPvs5(model) && includes(lastSuccessfulStage, [3, 4, 5])
      const throwIfAboutToFinish =
        aboutToFinishPvs5Fwup || aboutToFinishPvs6Fwup

      return timer(0, 1500).pipe(
        takeUntil(stopPolling$),
        exhaustMap(() => from(sendCommandToPVS('GetFWUpgradeStatus'))),
        map(status =>
          POLL_FIRMWARE_UPDATE(pick(['STATE', 'PERCENT', 'DL_PERCENT'], status))
        ),
        retryWhen(
          genericRetryStrategy({
            maxRetryAttempts: 90,
            shouldScaleTime: false,
            reThrow: throwIfAboutToFinish,
            reThrowMessage: aboutToFinishFwupPvsDisconnection
          })
        ),
        catchError(error => {
          if (error !== aboutToFinishFwupPvsDisconnection) {
            const { message } = error

            Sentry.addBreadcrumb({ message })
            Sentry.captureException(error)
          }

          return error === aboutToFinishFwupPvsDisconnection
            ? of(
                STOP_FIRMWARE_UPDATE_POLLING(aboutToFinishFwupPvsDisconnection)
              )
            : of(STOP_FIRMWARE_UPDATE_POLLING())
        })
      )
    })
  )
}

const firmwareWaitForWifi = (action$, state$) =>
  action$.pipe(
    ofType(
      STOP_FIRMWARE_UPDATE_POLLING.getType(),
      SET_CONNECTION_STATUS.getType()
    ),
    exhaustMap(({ type, payload }) => {
      const { lastSuccessfulStage } = state$.value.firmwareUpdate
      const { model } = state$.value.pvs

      const aboutToFinishPvs5Fwup =
        isPvs5(model) && includes(lastSuccessfulStage, [1, 2])
      const aboutToFinishPvs6Fwup =
        !isPvs5(model) && includes(lastSuccessfulStage, [3, 4, 5])
      const disconnectedFromPvs =
        includes(payload, [
          appConnectionStatus.NOT_CONNECTED_PVS,
          appConnectionStatus.NOT_USING_WIFI
        ]) || payload === aboutToFinishFwupPvsDisconnection

      console.warn({
        action: { type, payload },
        pvsModel: model,
        stage: lastSuccessfulStage,
        aboutToFinishPvsFwup: aboutToFinishPvs5Fwup || aboutToFinishPvs6Fwup,
        disconnectedFromPvs
      })

      const waitForPvsToReboot = concat(
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

      if (isPvs5(state$) && aboutToFinishPvs5Fwup && disconnectedFromPvs) {
        console.warn('Waiting for PVS5 to reboot')
        return waitForPvsToReboot
      }

      if (aboutToFinishPvs6Fwup && disconnectedFromPvs) {
        console.warn('Waiting for PVS6 to reboot')
        return waitForPvsToReboot
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
        ofType(
          PVS_CONNECTION_SUCCESS_AFTER_REBOOT.getType(),
          PVS_CONNECTION_SUCCESS.getType()
        ),
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

const forceStorageAfterPVSFWUPEpic = action$ =>
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
