import * as Sentry from '@sentry/browser'
import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { catchError, map, mergeMap } from 'rxjs/operators'
import { getFirmwareVersionData } from 'shared/fileSystem'
import { sendCommandToPVS } from 'shared/PVSUtils'
import { getPVSVersionNumber } from 'shared/utils'
import {
  FIRMWARE_GET_VERSION_COMPLETE,
  FIRMWARE_SHOW_MODAL
} from 'state/actions/firmwareUpdate'
import { PVS_CONNECTION_SUCCESS } from 'state/actions/network'
import { path, pathOr } from 'ramda'
import { EMPTY_ACTION } from 'state/actions/share'

export const getFirmwareUrlFromState = path([
  'value',
  'fileDownloader',
  'fileInfo',
  'updateURL'
])

const checkIfNeedToUpdatePVSToLatestVersion = async url => {
  try {
    const { version: PVSToVersion } = getFirmwareVersionData(url)
    const info = await sendCommandToPVS('GetSupervisorInformation')
    const PVSFromVersion = getPVSVersionNumber(info) || '-1'
    const model = pathOr('', ['supervisor', 'MODEL'], info)
    const shouldUpdate =
      !model.startsWith('PVS5') && PVSToVersion > PVSFromVersion
    return { shouldUpdate, PVSFromVersion, PVSToVersion }
  } catch (e) {
    return { shouldUpdate: false }
  }
}

const checkVersionPVS = (action$, state$) =>
  action$.pipe(
    ofType(PVS_CONNECTION_SUCCESS.getType()),
    mergeMap(() =>
      from(
        checkIfNeedToUpdatePVSToLatestVersion(getFirmwareUrlFromState(state$))
      ).pipe(
        map(({ shouldUpdate, PVSFromVersion, PVSToVersion }) =>
          state$.value.firmwareUpdate.upgrading
            ? EMPTY_ACTION()
            : shouldUpdate
            ? FIRMWARE_SHOW_MODAL({ PVSFromVersion, PVSToVersion })
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
