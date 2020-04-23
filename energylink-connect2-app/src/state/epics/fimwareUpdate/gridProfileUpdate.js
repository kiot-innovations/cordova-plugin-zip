import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { catchError, map, switchMap } from 'rxjs/operators'
import {
  GRID_PROFILE_UPLOAD_COMPLETE,
  GRID_PROFILE_UPLOAD_ERROR,
  GRID_PROFILE_UPLOAD_INIT
} from 'state/actions/firmwareUpdate'
import {
  getFileBlob,
  getGridProfileFileName
} from 'state/actions/fileDownloader'

/**
 * Will upload the Grid Profile file to the PVS and
 * execute the startUpgrade command
 * by using the redirect call from the PVS
 * @returns {Promise<Response>}
 */
const uploadGridProfile = async () => {
  try {
    const fileBlob = await getFileBlob(getGridProfileFileName())
    const formData = new FormData()
    formData.append('file', fileBlob)
    return await fetch(
      'http://sunpowerconsole.com/cgi-bin/upload-grid-profiles',
      {
        method: 'POST',
        body: formData
      }
    )
  } catch (e) {
    console.error(e)
  }
}

export const epicUploadGridProfile = action$ =>
  action$.pipe(
    ofType(GRID_PROFILE_UPLOAD_INIT.getType()),
    switchMap(() =>
      from(uploadGridProfile()).pipe(
        map(() => {
          return GRID_PROFILE_UPLOAD_COMPLETE()
        }),
        catchError(err => of(GRID_PROFILE_UPLOAD_ERROR.asError(err.message)))
      )
    )
  )

export default [epicUploadGridProfile]
