import { path } from 'ramda'
import { ofType } from 'redux-observable'
import { of } from 'rxjs'
import { concatMap, exhaustMap, take, map } from 'rxjs/operators'
import {
  PVS_FIRMWARE_MODAL_IS_CONNECTED,
  DOWNLOAD_ALLOW_WITH_PVS
} from 'state/actions/fileDownloader'
import { translate } from 'shared/i18n'
import { SHOW_MODAL } from 'state/actions/modal'

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

export default [PVSIsConnectedEpic, resumeActionWhenUserContinuesEpic]
