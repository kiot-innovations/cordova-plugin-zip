import * as Sentry from '@sentry/browser'
import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { catchError, map, mergeMap } from 'rxjs/operators'
import { getFirmwareVersionData } from 'shared/fileSystem'
import { sendCommandToPVS } from 'shared/PVSUtils'
import { getPVSVersionNumber } from 'shared/utils'
import {
  FIRMWARE_GET_VERSION_COMPLETE,
  FIRMWARE_UPDATE_INIT
} from 'state/actions/firmwareUpdate'
import { PVS_CONNECTION_SUCCESS } from 'state/actions/network'

const checkIfNeedToUpdatePVSToLatestVersion = async () => {
  try {
    const { version: serverVersion } = await getFirmwareVersionData()
    const PVSversion =
      getPVSVersionNumber(await sendCommandToPVS('GetSupervisorInformation')) ||
      '-1'
    const shouldUpdate = serverVersion > PVSversion
    return { shouldUpdate, PVSversion }
  } catch (e) {
    return { shouldUpdate: false }
  }
}

const checkVersionPVS = action$ =>
  action$.pipe(
    ofType(PVS_CONNECTION_SUCCESS.getType()),
    mergeMap(() =>
      from(checkIfNeedToUpdatePVSToLatestVersion()).pipe(
        map(({ shouldUpdate, PVSversion }) =>
          shouldUpdate
            ? FIRMWARE_UPDATE_INIT({ PVSversion })
            : FIRMWARE_GET_VERSION_COMPLETE()
        ),
        catchError(err => {
          Sentry.captureException(err)
          return of(FIRMWARE_GET_VERSION_COMPLETE())
        })
      )
    )
  )
export default checkVersionPVS
