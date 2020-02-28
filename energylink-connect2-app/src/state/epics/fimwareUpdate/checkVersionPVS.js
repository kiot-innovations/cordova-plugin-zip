import { compose, last, path, split } from 'ramda'
import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { catchError, map, mergeMap } from 'rxjs/operators'
import { getApiPVS } from 'shared/api'
import { waitFor } from 'shared/utils'
import { getFirmwareVersionNumber } from 'state/actions/fileDownloader'
import {
  FIRMWARE_GET_VERSION_COMPLETE,
  FIRMWARE_GET_VERSION_ERROR,
  FIRMWARE_UPDATE_INIT
} from 'state/actions/firmwareUpdate'
import { PVS_CONNECTION_SUCCESS } from 'state/actions/network'

const getVersionNumber = compose(
  Number,
  last,
  split('Build'),
  path(['body', 'supervisor', 'SWVER'])
)
const getPVSVersion = async () => {
  try {
    await waitFor(1000)
    const api = await getApiPVS()
    const res = await api.apis.pvs.getSupervisorInfo()
    const { version: serverVersion } = await getFirmwareVersionNumber()
    let PVSversion = '-1'
    if (res.ok) PVSversion = getVersionNumber(res)
    return serverVersion > PVSversion
  } catch (e) {
    throw new Error(e)
  }
}

const checkVersionPVS = action$ =>
  action$.pipe(
    ofType(PVS_CONNECTION_SUCCESS.getType()),
    mergeMap(() =>
      from(getPVSVersion()).pipe(
        map(shouldUpdate => {
          return shouldUpdate
            ? FIRMWARE_UPDATE_INIT()
            : FIRMWARE_GET_VERSION_COMPLETE()
        }),
        catchError(err => of(FIRMWARE_GET_VERSION_ERROR.asError(err.message)))
      )
    )
  )
export default checkVersionPVS
