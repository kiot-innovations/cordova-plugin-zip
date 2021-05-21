import * as Sentry from '@sentry/browser'
import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { catchError, map, switchMap } from 'rxjs/operators'

import {
  GRID_PROFILE_UPLOAD_COMPLETE,
  GRID_PROFILE_UPLOAD_ERROR,
  GRID_PROFILE_UPLOAD_INIT
} from 'state/actions/firmwareUpdate'
import { FETCH_GRID_BEHAVIOR } from 'state/actions/systemConfiguration'

import { ERROR_CODES, getFileBlob, getFileNameFromURL } from 'shared/fileSystem'
import { translate } from 'shared/i18n'
import { SHOW_MODAL } from 'state/actions/modal'
import { FIRMWARE_UPDATE_COMPLETE } from 'state/actions/firmwareUpdate'
import { EMPTY_ACTION } from 'state/actions/share'
import { SET_PVS_MODEL } from 'state/actions/pvs'
import {
  pvs6GridProfileUpdateUrl$,
  pvs5GridProfileUpdateUrl$,
  waitForObservable
} from 'state/epics/downloader/latestUrls'
import { isPvs5, getGPDownloadError } from 'shared/utils'

/**
 * Will upload the Grid Profile file to the PVS
 * @returns {Promise<Response>}
 */
const uploadGridProfile = async (error, { gridProfileUrl, isPvs5 }) => {
  if (error) {
    throw new Error(error)
  }

  try {
    const fileBlob = await getFileBlob(
      `firmware/${isPvs5 ? 'pvs5-' : 'pvs6-'}${getFileNameFromURL(
        gridProfileUrl
      )}`
    )
    const formData = new FormData()
    formData.append('file', fileBlob)
    return await fetch(process.env.REACT_APP_GRID_PROFILE_UPLOAD_ENDPOINT, {
      method: 'POST',
      body: formData
    })
  } catch (e) {
    Sentry.captureException(e)
    throw e
  }
}

export const epicUploadGridProfile = (action$, state$) =>
  action$.pipe(
    ofType(
      SET_PVS_MODEL.getType(),
      FIRMWARE_UPDATE_COMPLETE.getType(),
      GRID_PROFILE_UPLOAD_INIT.getType()
    ),
    waitForObservable(
      isPvs5(state$) ? pvs5GridProfileUpdateUrl$ : pvs6GridProfileUpdateUrl$
    ),
    switchMap(([, gridProfileUrl]) =>
      from(
        uploadGridProfile(getGPDownloadError(state$), {
          gridProfileUrl,
          isPvs5: isPvs5(state$)
        })
      ).pipe(
        switchMap(() =>
          of(GRID_PROFILE_UPLOAD_COMPLETE(), FETCH_GRID_BEHAVIOR())
        ),
        catchError(err => {
          Sentry.captureException(err)
          return of(GRID_PROFILE_UPLOAD_ERROR.asError(err.message))
        })
      )
    )
  )

export const epicGridProfileShowModal = (action$, state$) =>
  action$.pipe(
    ofType(GRID_PROFILE_UPLOAD_ERROR.getType()),
    map(() => {
      const t = translate()
      const error = getGPDownloadError(state$)

      return error === ERROR_CODES.MD5_NOT_MATCHING
        ? SHOW_MODAL({
            title: t('ATTENTION'),
            body: t('MD5_INTEGRITY_ERROR'),
            dismissable: true
          })
        : EMPTY_ACTION()
    })
  )

export default [epicUploadGridProfile, epicGridProfileShowModal]
