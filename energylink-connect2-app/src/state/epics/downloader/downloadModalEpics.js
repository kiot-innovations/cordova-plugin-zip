import { any, equals, path } from 'ramda'
import { ofType } from 'redux-observable'
import { concat, from, of } from 'rxjs'
import { concatMap, exhaustMap, take, map, catchError } from 'rxjs/operators'

import { translate } from 'shared/i18n'
import { hasInternetConnection } from 'shared/utils'
import { SHOW_MODAL } from 'state/actions/modal'
import { DOWNLOAD_META_ERROR, DOWNLOAD_OS_ERROR } from 'state/actions/ess'
import {
  PVS_FIRMWARE_MODAL_IS_CONNECTED,
  DOWNLOAD_ALLOW_WITH_PVS,
  PVS_DECOMPRESS_LUA_FILES_ERROR,
  PVS_FIRMWARE_DOWNLOAD_ERROR,
  DOWNLOAD_VERIFY,
  FILES_VERIFY,
  FILES_VERIFY_FAILED
} from 'state/actions/fileDownloader'
import { GRID_PROFILE_DOWNLOAD_ERROR } from 'state/actions/gridProfileDownloader'
import { EMPTY_ACTION } from 'state/actions/share'
import { MENU_DISPLAY_ITEM } from 'state/actions/ui'

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
 * Alerts that we are still downloading firmware files
 */
export const downloadingLatestFirmwareEpic = (action$, state$) =>
  action$.pipe(
    ofType(DOWNLOAD_VERIFY.getType()),
    exhaustMap(() => {
      const t = translate()

      const isDownloading = any(equals(true), [
        path(
          ['value', 'fileDownloader', 'verification', 'gpDownloading'],
          state$
        ),
        path(
          ['value', 'fileDownloader', 'verification', 'essDownloading'],
          state$
        ),
        path(
          ['value', 'fileDownloader', 'verification', 'pvsDownloading'],
          state$
        )
      ])

      if (path(['value', 'ui', 'menu', 'show'], state$)) {
        return of(EMPTY_ACTION('Already in download page'))
      }

      return isDownloading
        ? concat(
            of(
              SHOW_MODAL({
                title: t('ATTENTION'),
                componentPath: './Downloads/DownloadInProgressModal.jsx'
              })
            ),
            action$.pipe(
              ofType(MENU_DISPLAY_ITEM.getType()),
              map(EMPTY_ACTION),
              take(1)
            )
          )
        : of(FILES_VERIFY())
    })
  )

/**
 * Shows error downloading firmware files
 */
export const firmwareDownloadFailedEpic = action$ =>
  action$.pipe(
    ofType(
      DOWNLOAD_OS_ERROR.getType(),
      DOWNLOAD_META_ERROR.getType(),
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
  downloadingLatestFirmwareEpic,
  resumeActionWhenUserContinuesEpic
]
