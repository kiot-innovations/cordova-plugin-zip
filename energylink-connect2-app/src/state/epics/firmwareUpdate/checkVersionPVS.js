import { path, pathOr } from 'ramda'
import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { catchError, map, exhaustMap } from 'rxjs/operators'
import * as Sentry from 'sentry-cordova'

import { getFirmwareVersionData } from 'shared/fileSystem'
import { sendCommandToPVS } from 'shared/PVSUtils'
import { getPVSVersionNumber } from 'shared/utils'
import {
  FIRMWARE_UPDATE_CHECK_FAILURE,
  NO_FIRMWARE_UPDATE_AVAILABLE,
  SHOW_FIRMWARE_UPDATE_MODAL,
  FIRMWARE_UPDATE_COMPLETE
} from 'state/actions/firmwareUpdate'
import { PVS_CONNECTION_SUCCESS } from 'state/actions/network'
import { EMPTY_ACTION } from 'state/actions/share'

export const getFirmwareUrlFromState = path([
  'value',
  'fileDownloader',
  'fileInfo',
  'updateURL'
])

export const getDoNotUpdatePVSFromState = path([
  'value',
  'fileDownloader',
  'settings',
  'doNotUpdatePVS'
])

const checkIfNeedToUpdatePVSToLatestVersion = async (url, doNotUpdatePVS) => {
  try {
    const { version: PVSToVersion } = getFirmwareVersionData(url)
    const info = await sendCommandToPVS('GetSupervisorInformation')
    const PVSFromVersion = getPVSVersionNumber(info) || '-1'
    const model = pathOr('', ['supervisor', 'MODEL'], info)
    // if doNotUpdatePVS is true, then we should not update
    // else, use the logic we had in place already
    const shouldUpdate = doNotUpdatePVS
      ? false
      : !model.startsWith('PVS5') && PVSToVersion > PVSFromVersion
    return { shouldUpdate, PVSFromVersion, PVSToVersion }
  } catch (e) {
    return { shouldUpdate: false }
  }
}

const checkVersionPVS = (action$, state$) =>
  action$.pipe(
    ofType(
      PVS_CONNECTION_SUCCESS.getType(),
      FIRMWARE_UPDATE_COMPLETE.getType()
    ),
    exhaustMap(() =>
      from(
        checkIfNeedToUpdatePVSToLatestVersion(
          getFirmwareUrlFromState(state$),
          getDoNotUpdatePVSFromState(state$)
        )
      ).pipe(
        map(({ shouldUpdate, PVSFromVersion, PVSToVersion }) =>
          state$.value.firmwareUpdate.upgrading
            ? EMPTY_ACTION()
            : shouldUpdate
            ? SHOW_FIRMWARE_UPDATE_MODAL({ PVSFromVersion, PVSToVersion })
            : NO_FIRMWARE_UPDATE_AVAILABLE(PVSFromVersion)
        ),
        catchError(error => {
          Sentry.captureException(error)
          return of(FIRMWARE_UPDATE_CHECK_FAILURE(error))
        })
      )
    )
  )

export default checkVersionPVS