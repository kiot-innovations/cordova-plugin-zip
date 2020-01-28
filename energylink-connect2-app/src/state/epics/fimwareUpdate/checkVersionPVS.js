import { pathOr } from 'ramda'
import { EmptyActionCreator as FIRMWARE_GET_VERSION_ERROR } from 'redux-act'
import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { catchError, flatMap, map } from 'rxjs/operators'
import { getApiPVS } from 'shared/api'
import { getFirmwareVersionNumber } from 'state/actions/fileDownloader'
import {
  FIRMWARE_GET_VERSION_COMPLETE,
  FIRMWARE_UPDATE_INIT
} from 'state/actions/firmwareUpdate'
import { PVS_CONNECTION_SUCCESS } from 'state/actions/network'

const getPVSVersion = async () => {
  try {
    const api = await getApiPVS()
    const res = await api.apis.pvs.getSupervisorInfo()
    const { version: serverVersion } = await getFirmwareVersionNumber()
    let PVSversion = '-1'
    if (res.ok)
      PVSversion = pathOr('-1', ['body', 'supervisor', 'FWVER', 'FWVER'], res)
    return serverVersion !== PVSversion
  } catch (e) {
    console.warn('ESTEBAMN', e.message)
    throw new Error(e)
  }
}

const checkVersionPVS = action$ =>
  action$.pipe(
    ofType(PVS_CONNECTION_SUCCESS.getType()),
    flatMap(() =>
      from(getPVSVersion()).pipe(
        map(shouldUpdate =>
          shouldUpdate
            ? FIRMWARE_UPDATE_INIT()
            : FIRMWARE_GET_VERSION_COMPLETE()
        ),
        catchError(err => of(FIRMWARE_GET_VERSION_ERROR.asError(err.message)))
      )
    )
  )
export default checkVersionPVS
