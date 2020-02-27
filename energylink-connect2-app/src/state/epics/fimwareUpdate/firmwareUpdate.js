import { path, pick } from 'ramda'
import { ofType } from 'redux-observable'
import { from, of, timer } from 'rxjs'
import { catchError, flatMap, map, switchMap, takeUntil } from 'rxjs/operators'
import { getApiPVS } from 'shared/api'
import { waitFor } from 'shared/utils'
import {
  getFileBlob,
  getFirmwareVersionNumber
} from 'state/actions/fileDownloader'
import {
  FIRMWARE_UPDATE_ERROR,
  FIRMWARE_UPDATE_INIT,
  FIRMWARE_UPDATE_POLL_INIT,
  FIRMWARE_UPDATE_POLL_STOP,
  FIRMWARE_UPDATE_POLLING
} from 'state/actions/firmwareUpdate'
import { PVS_CONNECTION_INIT } from 'state/actions/network'

/**
 * Will upload the FS to the PVS and
 * execute the startUpgrade command
 * by using the redirect call from the PVS
 * @returns {Promise<Response>}
 */
const uploadFirmwarePVS = async () => {
  try {
    const { luaFileName } = await getFirmwareVersionNumber()
    const fileBlob = await getFileBlob(`${luaFileName}.fs`)
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
 * Will ask the PVS if the upgrade has finished
 * @returns {Promise<boolean>}
 */
const getUpgradeStatus = async () => {
  const swagger = await getApiPVS()
  console.warn(swagger)
  const res = await swagger.apis.firmware.getUpgradeStatus()
  return res.body
}

const firmwareUpgradeInit = action$ =>
  action$.pipe(
    ofType(FIRMWARE_UPDATE_INIT.getType()),
    flatMap(() =>
      from(uploadFirmwarePVS()).pipe(
        switchMap(async () => FIRMWARE_UPDATE_POLL_INIT()),
        catchError(err => of(FIRMWARE_UPDATE_ERROR.asError(err)))
      )
    )
  )

export const firmwarePollStatus = action$ => {
  const stopPolling$ = action$.pipe(ofType(FIRMWARE_UPDATE_POLL_STOP.getType()))
  return action$.pipe(
    ofType(FIRMWARE_UPDATE_POLL_INIT.getType()),
    switchMap(() =>
      timer(0, 1000).pipe(
        takeUntil(stopPolling$),
        switchMap(() => from(getUpgradeStatus())),
        map(status => {
          console.warn('STATUS', status)
          return path(['STATE'], status) === 'complete'
            ? FIRMWARE_UPDATE_POLL_STOP()
            : FIRMWARE_UPDATE_POLLING(pick(['STATE', 'PERCENT'], status))
        })
      )
    )
  )
}

const firmwareWaitForWifi = (action$, state$) =>
  action$.pipe(
    ofType(FIRMWARE_UPDATE_POLL_STOP.getType()),
    switchMap(() => {
      from(waitFor(1000 * 60)).pipe(
        switchMap(async () =>
          PVS_CONNECTION_INIT({
            ssid: state$.value.network.SSID,
            password: state$.value.network.password
          })
        )
      )
    })
  )

export default [firmwareUpgradeInit, firmwarePollStatus, firmwareWaitForWifi]
