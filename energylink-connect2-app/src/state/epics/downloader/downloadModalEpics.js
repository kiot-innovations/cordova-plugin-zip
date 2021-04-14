import { path } from 'ramda'
import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { catchError, concatMap, exhaustMap, map, take } from 'rxjs/operators'

import { translate } from 'shared/i18n'
import { hasInternetConnection } from 'shared/utils'
import { DOWNLOAD_OS_ERROR } from 'state/actions/ess'
import {
  DOWNLOAD_ALLOW_WITH_PVS,
  FILES_VERIFY_FAILED,
  PVS_DECOMPRESS_LUA_FILES_ERROR,
  PVS_FIRMWARE_DOWNLOAD_ERROR,
  PVS_FIRMWARE_MODAL_IS_CONNECTED
} from 'state/actions/fileDownloader'
import { GRID_PROFILE_DOWNLOAD_ERROR } from 'state/actions/gridProfileDownloader'
import { SHOW_MODAL } from 'state/actions/modal'
import { EMPTY_ACTION } from 'state/actions/share'

export const modalPVSConnected = () => {
  const t = translate()
  return SHOW_MODAL({
    title: t('ATTENTION'),
    componentPath: './DownloadConnectedToPVSModal.jsx'
  })
}

/**
 * Show modal if the user is connected to the PVS
 * @param action$
 * @returns {*}
 */
export const PVSIsConnectedEpic = action$ =>
  action$.pipe(
    ofType(PVS_FIRMWARE_MODAL_IS_CONNECTED.getType()),
    exhaustMap(() => of(modalPVSConnected()))
  )

/**
 * Receives the actions that need to be resumed when the user press the continue button
 * @param action$
 * @returns {*}
 */
export const resumeActionWhenUserContinuesEpic = (action$, state$) =>
  action$.pipe(
    ofType(PVS_FIRMWARE_MODAL_IS_CONNECTED.getType()),
    concatMap(({ payload: actionToTrigger }) => {
      const allowWifiDownloadSetting = path(
        ['value', 'fileDownloader', 'settings', 'allowDownloadWithPVS'],
        state$
      )

      if (allowWifiDownloadSetting) {
        return of(actionToTrigger)
      }

      return action$.pipe(
        ofType(DOWNLOAD_ALLOW_WITH_PVS.getType()),
        map(() => actionToTrigger),
        take(1)
      )
    })
  )

/**
 * Shows error downloading firmware files
 */
export const firmwareDownloadFailedEpic = action$ =>
  action$.pipe(
    ofType(
      DOWNLOAD_OS_ERROR.getType(),
      GRID_PROFILE_DOWNLOAD_ERROR.getType(),
      PVS_FIRMWARE_DOWNLOAD_ERROR.getType(),
      PVS_DECOMPRESS_LUA_FILES_ERROR.getType(),
      FILES_VERIFY_FAILED.getType()
    ),
    exhaustMap(() =>
      from(hasInternetConnection()).pipe(
        map(() => {
          const t = translate()
          return SHOW_MODAL({
            title: t('ATTENTION'),
            componentPath: './Downloads/DownloadFailedModal.jsx'
          })
        }),
        catchError(() => of(EMPTY_ACTION('No internet connection')))
      )
    )
  )

export default [
  PVSIsConnectedEpic,
  firmwareDownloadFailedEpic,
  resumeActionWhenUserContinuesEpic
]
