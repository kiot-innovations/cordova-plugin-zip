import { compose, last, path, split } from 'ramda'
import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { catchError, map, mergeMap } from 'rxjs/operators'
import { isThePVSAdama } from 'shared/utils'
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
    const shouldUpdate = serverVersion > PVSversion
    const isAdama = await isThePVSAdama()
    console.warn('IS ADAMA:', isAdama)
    console.warn('PVS version:', isAdama)
    return { shouldUpdate, isAdama }
  } catch (e) {
    throw new Error(e)
  }
}

const checkVersionPVS = action$ =>
  action$.pipe(
    ofType(PVS_CONNECTION_SUCCESS.getType()),
    mergeMap(() =>
      from(checkIfNeedToUpdatePVSToLatestVersion()).pipe(
        map(({ shouldUpdate, isAdama }) => {
          return shouldUpdate
            ? FIRMWARE_UPDATE_INIT(isAdama)
            : FIRMWARE_GET_VERSION_COMPLETE()
        }),
        catchError(err => of(FIRMWARE_GET_VERSION_ERROR.asError(err.message)))
      )
    )
  )
export default checkVersionPVS
