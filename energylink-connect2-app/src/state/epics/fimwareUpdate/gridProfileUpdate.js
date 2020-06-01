import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { catchError, map, switchMap } from 'rxjs/operators'
import * as Sentry from '@sentry/browser'

import {
  FIRMWARE_GET_VERSION_COMPLETE,
  GRID_PROFILE_UPLOAD_COMPLETE,
  GRID_PROFILE_UPLOAD_ERROR
} from 'state/actions/firmwareUpdate'
import { getFileBlob, getGridProfileFilePath } from 'shared/fileSystem'

/**
 * Will upload the Grid Profile file to the PVS
 * @returns {Promise<Response>}
 */
const uploadGridProfile = async () => {
  try {
    const fileBlob = await getFileBlob(getGridProfileFilePath())
    const formData = new FormData()
    formData.append('file', fileBlob)
    return await fetch(process.env.REACT_APP_GRID_PROFILE_UPLOAD_ENDPOINT, {
      method: 'POST',
      body: formData
    })
  } catch (e) {
    Sentry.captureException(e)
  }
}

export const epicUploadGridProfile = action$ =>
  action$.pipe(
    ofType(FIRMWARE_GET_VERSION_COMPLETE.getType()),
    switchMap(() =>
      from(uploadGridProfile()).pipe(
        map(() => GRID_PROFILE_UPLOAD_COMPLETE()),
        catchError(err => of(GRID_PROFILE_UPLOAD_ERROR.asError(err.message)))
      )
    )
  )

export default [epicUploadGridProfile]
