import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { catchError, map, switchMap } from 'rxjs/operators'
import {
  FIRMWARE_GET_VERSION_COMPLETE,
  GRID_PROFILE_UPLOAD_COMPLETE,
  GRID_PROFILE_UPLOAD_ERROR
} from 'state/actions/firmwareUpdate'
import { getFileBlob } from 'state/actions/fileDownloader'
import { getGridProfileFileName } from 'state/actions/gridProfileDownloader'

/**
 * Will upload the Grid Profile file to the PVS
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
    ofType(FIRMWARE_GET_VERSION_COMPLETE.getType()),
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
