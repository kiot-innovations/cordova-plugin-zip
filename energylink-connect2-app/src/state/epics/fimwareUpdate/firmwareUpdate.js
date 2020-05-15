import * as Sentry from '@sentry/browser'
import { path, pick } from 'ramda'
import { ofType } from 'redux-observable'
import { concat, from, of, timer } from 'rxjs'
import { catchError, exhaustMap, map, take, takeUntil } from 'rxjs/operators'
import { getApiPVS } from 'shared/api'
import { translate } from 'shared/i18n'
import { sendCommandToPVS } from 'shared/PVSUtils'
import { getPVSVersionNumber, waitFor } from 'shared/utils'
import {
  getFirmwareUpgradePackageURL,
  startWebserver,
  stopWebserver
} from 'shared/webserver'
import { getFileBlob, getPVSFileSystemName } from 'state/actions/fileDownloader'
import {
  FIRMWARE_UPDATE_COMPLETE,
  FIRMWARE_UPDATE_ERROR,
  FIRMWARE_UPDATE_INIT,
  FIRMWARE_UPDATE_POLL_INIT,
  FIRMWARE_UPDATE_POLL_STOP,
  FIRMWARE_UPDATE_POLLING,
  FIRMWARE_UPDATE_WAITING_FOR_NETWORK
} from 'state/actions/firmwareUpdate'
import {
  PVS_CONNECTION_INIT,
  PVS_CONNECTION_SUCCESS,
  STOP_NETWORK_POLLING
} from 'state/actions/network'

const getFirmwareFromState = path([
  'value',
  'firmwareUpdate',
  'versionBeforeUpgrade'
])

/**
 * Will ask the PVS if the upgrade has finished
 * @returns {Promise<boolean>}
 */
const getUpgradeStatus = async isAdama => {
  if (isAdama) return await sendCommandToPVS('GetFWUpgradeStatus')

  const swagger = await getApiPVS()
  const res = await swagger.apis.firmware.getUpgradeStatus()
  return res.body
}

async function uploadFirmwareToAdama() {
  await startWebserver()
  const fileUrl = await getFirmwareUpgradePackageURL()
  return await sendCommandToPVS(`StartFWUpgrade&url=${fileUrl}`)
}

async function uploadFirmwareToPVS(isAdama) {
  if (isAdama) {
    return await uploadFirmwareToAdama()
  }
  // Will upload the firmware to the PVS (Boomer or later)
  try {
    const fileBlob = await getFileBlob(await getPVSFileSystemName())
    const formData = new FormData()
    formData.append('firmware', fileBlob)
    //TODO use the SWAGGER client, for some reason it is not working at the moment (2020-27-02)
    return await fetch('http://sunpowerconsole.com/cgi-bin/upload_firmware', {
      method: 'POST',
      body: formData
    })
  } catch (e) {
    console.error(e)
  }
}

/**
 * Epic that will upload the FS to the PVS
 * @param action$
 * @returns {*}
 */
const firmwareUpgradeInit = action$ =>
  action$.pipe(
    ofType(FIRMWARE_UPDATE_INIT.getType()),
    exhaustMap(({ payload }) => {
      const { isAdama } = payload
      return from(uploadFirmwareToPVS(isAdama)).pipe(
        map(() => FIRMWARE_UPDATE_POLL_INIT(isAdama)),
        catchError(err => of(FIRMWARE_UPDATE_ERROR.asError(err)))
      )
    })
  )

export const firmwarePollStatus = (action$, state$) => {
  const t = translate(state$.value.language)
  const stopPolling$ = action$.pipe(ofType(FIRMWARE_UPDATE_POLL_STOP.getType()))
  return action$.pipe(
    ofType(FIRMWARE_UPDATE_POLL_INIT.getType()),
    exhaustMap(({ payload: isAdama }) =>
      timer(0, 1500).pipe(
        takeUntil(stopPolling$),
        exhaustMap(() => from(getUpgradeStatus(isAdama))),
        map(status => {
          return path(['STATE'], status) === 'complete'
            ? FIRMWARE_UPDATE_POLL_STOP()
            : FIRMWARE_UPDATE_POLLING(pick(['STATE', 'PERCENT'], status))
        }),
        catchError(() => {
          const firmware = getFirmwareFromState(state$)
          const errorMsg = t('ERROR_POLLING_UPGRADE', firmware)
          Sentry.captureException(new Error(errorMsg))

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
        from(waitFor(1000 * 60)).pipe(
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
            catchError(err => of(FIRMWARE_UPDATE_ERROR(t(err.message))))
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
  firmwareUpdateSuccessEpic
]
