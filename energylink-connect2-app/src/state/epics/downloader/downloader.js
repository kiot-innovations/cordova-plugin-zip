import { propOr, pathOr } from 'ramda'
import { of, EMPTY } from 'rxjs'
import { ofType } from 'redux-observable'
import { concatMap, map, switchMap, take } from 'rxjs/operators'

import {
  DOWNLOAD_ABORT,
  DOWNLOAD_INIT,
  DOWNLOAD_FINISHED,
  DOWNLOAD_SUCCESS,
  DOWNLOAD_ERROR
} from 'state/actions/fileDownloader'
import { PVS_CONNECTION_INIT } from 'state/actions/network'

export const epicDownload = action$ =>
  action$.pipe(
    ofType(DOWNLOAD_INIT.getType()),
    concatMap(({ payload }) => {
      const initialized = event => {
        window.downloader.get(payload.fileUrl, null, payload.fileName)
        event.target.removeEventListener(event.name, initialized)
      }

      document.addEventListener('DOWNLOADER_initialized', initialized)

      if (window.downloader) {
        window.downloader.init({
          folder: propOr('luaFiles', 'folder', payload),
          unzip: propOr(false, 'unzip', payload),
          wifiOnly: propOr(false, 'wifiOnly', payload)
        })
      }

      return action$.pipe(
        ofType(DOWNLOAD_FINISHED.getType()),
        take(1),
        map(({ payload, error }) =>
          error ? DOWNLOAD_ERROR(payload) : DOWNLOAD_SUCCESS(payload)
        )
      )
    })
  )

export const abortDownload = (action$, state$) =>
  action$.pipe(
    ofType(PVS_CONNECTION_INIT.getType(), DOWNLOAD_ABORT.getType()),
    switchMap(() => {
      const isDownloading = pathOr(
        false,
        ['value', 'fileDownloader', 'progress', 'downloading'],
        state$
      )

      if (isDownloading) {
        return of(DOWNLOAD_FINISHED())
      }

      return EMPTY
    })
  )

export default [epicDownload, abortDownload]
