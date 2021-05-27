import * as Sentry from '@sentry/browser'
import { path, pick, propOr } from 'ramda'
import { ofType } from 'redux-observable'
import { concat, from, of, timer } from 'rxjs'
import {
  catchError,
  exhaustMap,
  map,
  mergeMap,
  retryWhen,
  take,
  takeUntil
} from 'rxjs/operators'
import { ERROR_CODES } from 'shared/fileSystem'
import { translate } from 'shared/i18n'
import { sendCommandToPVS } from 'shared/PVSUtils'
import { getPVSVersionNumber, waitFor } from 'shared/utils'
import genericRetryStrategy from 'shared/rxjs/genericRetryStrategy'

import {
  getFirmwareUpgradePackageURL,
  startWebserver,
  stopWebserver
} from 'shared/webserver'

import {
  FIRMWARE_SHOW_MODAL,
  FIRMWARE_UPDATE_COMPLETE,
  FIRMWARE_UPDATE_ERROR,
  FIRMWARE_UPDATE_ERROR_NO_FILE,
  FIRMWARE_UPDATE_INIT,
  FIRMWARE_UPDATE_POLL_INIT,
  FIRMWARE_UPDATE_POLL_STOP,
  FIRMWARE_UPDATE_POLLING,
  FIRMWARE_UPDATE_WAITING_FOR_NETWORK
} from 'state/actions/firmwareUpdate'
import {
  PVS_CONNECTION_CLOSE,
  PVS_CONNECTION_CLOSE_FINISHED,
  PVS_CONNECTION_INIT,
  PVS_CONNECTION_SUCCESS,
  STOP_NETWORK_POLLING
} from 'state/actions/network'
import {
  PVS_FIRMWARE_DOWNLOAD_INIT,
  PVS_FIRMWARE_DOWNLOAD_SUCCESS
} from 'state/actions/fileDownloader'
import { SHOW_MODAL } from 'state/actions/modal'

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
    ofType(FIRMWARE_SHOW_MODAL.getType()),
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
 * Epic that will upload the FS to the PVS
 * @param action$
 * @returns {*}
 */
export const firmwareUpgradeInit = action$ =>
  action$.pipe(
    ofType(FIRMWARE_UPDATE_INIT.getType()),
    exhaustMap(() =>
      from(uploadFirmwareToAdama()).pipe(
        map(() => FIRMWARE_UPDATE_POLL_INIT()),
        catchError(err =>
          err.message === ERROR_CODES.NO_FILESYSTEM_FILE
            ? of(FIRMWARE_UPDATE_ERROR_NO_FILE())
            : of(FIRMWARE_UPDATE_ERROR.asError(err))
        )
      )
    )
  )

/**
 * If the firmware file doesn't exist we disconnect from the PVS
 * @param action$
 * @returns {*}
 */
export const firmwareDisconnectFromPVS = action$ =>
  action$.pipe(
    ofType(
      FIRMWARE_UPDATE_ERROR_NO_FILE.getType(),
      FIRMWARE_UPDATE_ERROR.getType()
    ),
    map(PVS_CONNECTION_CLOSE)
  )

/**
 * When PVS_CONNECTION_CLOSE_FINISHED we wait for the firmware to get downloaded
 * @param action$
 * @returns {*}
 */
export const initFirmwareDownload = (action$, state$) =>
  action$.pipe(
    ofType(PVS_CONNECTION_CLOSE_FINISHED.getType()),
    mergeMap(() =>
      concat(
        of(PVS_FIRMWARE_DOWNLOAD_INIT()),
        action$.pipe(
          ofType(PVS_FIRMWARE_DOWNLOAD_SUCCESS.getType()),
          take(1),
          map(() =>
            PVS_CONNECTION_INIT({
              ssid: state$.value.network.SSID,
              password: state$.value.network.password
            })
          )
        )
      )
    )
  )

export const firmwarePollStatus = action$ => {
  const stopPolling$ = action$.pipe(
    ofType(FIRMWARE_UPDATE_POLL_STOP.getType(), FIRMWARE_UPDATE_ERROR.getType())
  )
  return action$.pipe(
    ofType(FIRMWARE_UPDATE_POLL_INIT.getType()),
    exhaustMap(() =>
      timer(0, 1500).pipe(
        takeUntil(stopPolling$),
        exhaustMap(() => from(sendCommandToPVS('GetFWUpgradeStatus'))),
        map(status =>
          propOr('complete', 'STATE', status) === 'complete'
            ? FIRMWARE_UPDATE_POLL_STOP()
            : FIRMWARE_UPDATE_POLLING(pick(['STATE', 'PERCENT'], status))
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
          return of(FIRMWARE_UPDATE_POLL_STOP())
        })
      )
    )
  )
}

const firmwareWaitForWifi = (action$, state$) =>
  action$.pipe(
    ofType(FIRMWARE_UPDATE_POLL_STOP.getType()),
    exhaustMap(() =>
      concat(
        of(STOP_NETWORK_POLLING()),
        of(FIRMWARE_UPDATE_WAITING_FOR_NETWORK()),
        from(waitFor(1000 * 100)).pipe(
          map(() =>
            PVS_CONNECTION_INIT({
              ssid: state$.value.network.SSID,
              password: state$.value.network.password
            })
          )
        )
      )
    )
  )

async function didThePVSUpgrade(lastVersion) {
  const PVSinfo = await sendCommandToPVS('GetSupervisorInformation')
  const PVSversion = getPVSVersionNumber(PVSinfo)
  if (PVSversion > lastVersion) return true
  throw new Error('UPDATE_WENT_WRONG')
}

const firmwareUpdateSuccessEpic = (action$, state$) => {
  const t = translate(state$.value.language)
  return action$.pipe(
    ofType(FIRMWARE_UPDATE_WAITING_FOR_NETWORK.getType()),
    exhaustMap(() =>
      action$.pipe(
        ofType(PVS_CONNECTION_SUCCESS.getType()),
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

export default [
  firmwareUpgradeInit,
  firmwarePollStatus,
  firmwareWaitForWifi,
  firmwareUpdateSuccessEpic,
  firmwareDisconnectFromPVS,
  initFirmwareDownload,
  firmwareShowModal
]
