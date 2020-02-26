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
    console.log('WAITING FOR 1 second')
    console.time('waiting')
    await waitFor(1000)
    console.timeEnd('waiting')
    console.log('GET PVS VERSION')
    const api = await getApiPVS()
    console.log('API', api)
    const res = await api.apis.pvs.getSupervisorInfo()
    console.log('RES', res)
    const { version: serverVersion } = await getFirmwareVersionNumber()
    console.log('VERSION', serverVersion)
    let PVSversion = '-1'
    if (res.ok) PVSversion = getVersionNumber(res)
    console.log('VERSIONS')
    console.log(PVSversion, serverVersion)
    console.log(serverVersion > PVSversion)
    return serverVersion > PVSversion
  } catch (e) {
    console.log('I EXPLOTED', e)
    throw new Error(e)
  }
}

const checkVersionPVS = action$ =>
  action$.pipe(
    ofType(PVS_CONNECTION_SUCCESS.getType()),
    mergeMap(() =>
      from(getPVSVersion()).pipe(
        map(shouldUpdate => {
          console.log('SHOULD UPDATE')
          console.log(shouldUpdate)
          return shouldUpdate
            ? FIRMWARE_UPDATE_INIT()
            : FIRMWARE_GET_VERSION_COMPLETE()
        }),
        catchError(err => of(FIRMWARE_GET_VERSION_ERROR.asError(err.message)))
      )
    )
  )
export default checkVersionPVS
