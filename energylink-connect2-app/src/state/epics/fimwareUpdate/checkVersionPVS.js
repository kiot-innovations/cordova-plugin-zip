import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { catchError, map, mergeMap } from 'rxjs/operators'
import { isThePVSAdama, sendCommandToPVS } from 'shared/PVSUtils'
import { getPVSVersionNumber } from 'shared/utils'
import {
  FIRMWARE_GET_VERSION_COMPLETE,
  FIRMWARE_GET_VERSION_ERROR,
  FIRMWARE_UPDATE_INIT
} from 'state/actions/firmwareUpdate'
import { PVS_CONNECTION_SUCCESS } from 'state/actions/network'
import { getFirmwareVersionData } from 'shared/fileSystem'

const checkIfNeedToUpdatePVSToLatestVersion = async () => {
  try {
    const { version: serverVersion } = await getFirmwareVersionData()
    const PVSversion =
      getPVSVersionNumber(await sendCommandToPVS('GetSupervisorInformation')) ||
      '-1'
    const shouldUpdate = serverVersion > PVSversion
    return { shouldUpdate, isAdama: await isThePVSAdama(), PVSversion }
  } catch (e) {
    return { shouldUpdate: false }
  }
}

const checkVersionPVS = action$ =>
  action$.pipe(
    ofType(PVS_CONNECTION_SUCCESS.getType()),
    mergeMap(() =>
      from(checkIfNeedToUpdatePVSToLatestVersion()).pipe(
        map(({ shouldUpdate, isAdama, PVSversion }) => {
          return shouldUpdate
            ? FIRMWARE_UPDATE_INIT({ isAdama, PVSversion })
            : FIRMWARE_GET_VERSION_COMPLETE()
        }),
        catchError(err => of(FIRMWARE_GET_VERSION_ERROR.asError(err.message)))
      )
    )
  )
export default checkVersionPVS
