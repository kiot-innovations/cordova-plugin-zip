import { path } from 'ramda'
import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { catchError, map, exhaustMap } from 'rxjs/operators'
import * as Sentry from 'sentry-cordova'

import { getFirmwareVersionData, getPVS5FwVersionData } from 'shared/fileSystem'
import { sendCommandToPVS } from 'shared/PVSUtils'
import { getPVSVersionNumber, isPvs5 } from 'shared/utils'
import {
  FIRMWARE_UPDATE_CHECK_FAILURE,
  NO_FIRMWARE_UPDATE_AVAILABLE,
  SHOW_FIRMWARE_UPDATE_MODAL,
  FIRMWARE_UPDATE_COMPLETE
} from 'state/actions/firmwareUpdate'
import { SET_PVS_MODEL } from 'state/actions/pvs'
import { EMPTY_ACTION } from 'state/actions/share'

const pvs6FwUrl = ['value', 'fileDownloader', 'fileInfo', 'updateURL']

const pvs5FwUrl = ['value', 'fileDownloader', 'pvs5Fw', 'updateURL']

export const getFirmwareUrlFromState = state$ =>
  isPvs5(state$) ? path(pvs5FwUrl, state$) : path(pvs6FwUrl, state$)

export const getDoNotUpdatePVSFromState = path([
  'value',
  'fileDownloader',
  'settings',
  'doNotUpdatePVS'
])

const checkIfNeedToUpdatePVSToLatestVersion = async (
  url,
  isPvs5,
  doNotUpdatePVS
) => {
  try {
    const versionData = isPvs5
      ? getPVS5FwVersionData(url)
      : getFirmwareVersionData(url)
    const { buildNumber: pvs5Version } = versionData
    const { version: pvs6Version } = versionData
    const PVSToVersion = isPvs5 ? pvs5Version : pvs6Version
    const pvsInfo = await sendCommandToPVS('GetSupervisorInformation')
    const PVSFromVersion = getPVSVersionNumber(pvsInfo) || '-1'
    const shouldUpdate = doNotUpdatePVS ? false : PVSToVersion > PVSFromVersion

    return { shouldUpdate, PVSFromVersion, PVSToVersion }
  } catch (e) {
    return { shouldUpdate: false }
  }
}

const checkVersionPVS = (action$, state$) =>
  action$.pipe(
    ofType(SET_PVS_MODEL.getType(), FIRMWARE_UPDATE_COMPLETE.getType()),
    exhaustMap(() =>
      from(
        checkIfNeedToUpdatePVSToLatestVersion(
          getFirmwareUrlFromState(state$),
          isPvs5(state$),
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
