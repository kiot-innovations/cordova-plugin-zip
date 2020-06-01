import { pathOr } from 'ramda'
import { ofType } from 'redux-observable'
import { from, of, EMPTY } from 'rxjs'
import { catchError, concatMap, exhaustMap, map } from 'rxjs/operators'

import {
  DOWNLOAD_ERROR,
  DOWNLOAD_INIT,
  DOWNLOAD_SUCCESS
} from 'state/actions/fileDownloader'
import {
  GRID_PROFILE_GET_FILE,
  GRID_PROFILE_SET_FILE_INFO,
  GRID_PROFILE_DOWNLOAD_INIT
} from 'state/actions/gridProfileDownloader'
import {
  getFileInfo,
  getGridProfileFileName,
  getGridProfileFilePath
} from 'shared/fileSystem'

/**
 * Sets the file info if the file is in the FS
 * Or triggers GRID_PROFILE_DOWNLOAD_INIT to start a new download
 * @param action$
 * @returns {*}
 */
export const epicGetGridProfileFromFS = action$ =>
  action$.pipe(
    ofType(GRID_PROFILE_GET_FILE.getType()),
    exhaustMap(() =>
      from(getFileInfo(getGridProfileFilePath())).pipe(
        map(fileInfo => GRID_PROFILE_SET_FILE_INFO({ ...fileInfo })),
        catchError(() => of(GRID_PROFILE_DOWNLOAD_INIT()))
      )
    )
  )

export const epicInitDownloadGridProfile = action$ =>
  action$.pipe(
    ofType(GRID_PROFILE_DOWNLOAD_INIT.getType()),
    exhaustMap(() =>
      of(
        DOWNLOAD_INIT({
          fileUrl: process.env.REACT_APP_GRID_PROFILE_URL,
          folder: 'firmware',
          fileName: getGridProfileFileName()
        })
      )
    )
  )

export const epicDownloadGridProfile = action$ =>
  action$.pipe(
    ofType(DOWNLOAD_SUCCESS.getType(), DOWNLOAD_ERROR.getType()),
    concatMap(action =>
      pathOr('', ['payload', 'name'], action) === getGridProfileFileName()
        ? of(GRID_PROFILE_GET_FILE())
        : EMPTY
    )
  )

export default [
  epicGetGridProfileFromFS,
  epicDownloadGridProfile,
  epicInitDownloadGridProfile
]
