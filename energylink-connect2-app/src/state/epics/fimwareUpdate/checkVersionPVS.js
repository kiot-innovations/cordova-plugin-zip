import { compose, last, path, split } from 'ramda'
import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { catchError, map, mergeMap } from 'rxjs/operators'
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
  path(['supervisor', 'SWVER'])
)

const checkIfNeedToUpdatePVSToLatestVersion = async () => {
  try {
    const res = await fetch(
      'http://sunpowerconsole.com/cgi-bin/dl_cgi?Command=GetSupervisorInformation'
    )
    const { version: serverVersion } = await getFirmwareVersionNumber()
    let PVSversion = '-1'
    if (res.ok) PVSversion = getVersionNumber(await res.json())
    return serverVersion > PVSversion
  } catch (e) {
    throw new Error(e)
  }
}

const checkVersionPVS = action$ =>
  action$.pipe(
    ofType(PVS_CONNECTION_SUCCESS.getType()),
    mergeMap(() =>
      from(checkIfNeedToUpdatePVSToLatestVersion()).pipe(
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
