import { propOr } from 'ramda'
import { forkJoin, from, of, EMPTY } from 'rxjs'
import { catchError, exhaustMap, map, withLatestFrom } from 'rxjs/operators'
import { ofType } from 'redux-observable'
import * as Sentry from '@sentry/browser'

import {
  GRID_PROFILE_DOWNLOAD_ERROR,
  GRID_PROFILE_DOWNLOAD_INIT,
  GRID_PROFILE_DOWNLOAD_PROGRESS,
  GRID_PROFILE_DOWNLOAD_SUCCESS,
  GRID_PROFILE_REPORT_SUCCESS
} from 'state/actions/gridProfileDownloader'
import { ERROR_CODES, getFileInfo, getFileNameFromURL } from 'shared/fileSystem'
import fileTransferObservable from 'state/epics/observables/downloader'
import { getExpectedMD5, hasInternetConnection } from 'shared/utils'
import { getMd5FromFile } from 'shared/cordovaMapping'
import { EMPTY_ACTION } from 'state/actions/share'
import { gridProfileUpdateUrl$ } from 'state/epics/downloader/latestUrls'
import { waitForObservable } from './latestUrls'

export const initDownloadGridProfileEpic = action$ =>
  action$.pipe(
    ofType(GRID_PROFILE_DOWNLOAD_INIT.getType()),
    waitForObservable(gridProfileUpdateUrl$),
    exhaustMap(([action, gridProfileUrl]) =>
      fileTransferObservable({
        path: `firmware/${getFileNameFromURL(gridProfileUrl)}`,
        url: gridProfileUrl,
        retry: propOr(false, 'payload', action),
        fileExtention: 'gz'
      }).pipe(
        map(({ entry, progress }) =>
          progress
            ? GRID_PROFILE_DOWNLOAD_PROGRESS(progress)
            : GRID_PROFILE_REPORT_SUCCESS(`firmware/${entry.name}`)
        ),
        catchError(err => {
          Sentry.addBreadcrumb({
            message: 'Downloading grid profile'
          })
          Sentry.captureException(err)
          return of(GRID_PROFILE_DOWNLOAD_ERROR(err))
        })
      )
    )
  )

export const gridProfileReportSuccessEpic = action$ =>
  action$.pipe(
    ofType(GRID_PROFILE_REPORT_SUCCESS.getType()),
    withLatestFrom(gridProfileUpdateUrl$),
    exhaustMap(([{ payload }, gridProfileURl]) =>
      forkJoin([
        from(getFileInfo(payload)),
        from(getMd5FromFile(payload)),
        from(getExpectedMD5(gridProfileURl))
      ]).pipe(
        map(([{ size, lastModified }, fileMd5, expectedMd5]) =>
          fileMd5 === expectedMd5
            ? GRID_PROFILE_DOWNLOAD_SUCCESS({ size, lastModified })
            : GRID_PROFILE_DOWNLOAD_ERROR({
                error: ERROR_CODES.MD5_NOT_MATCHING,
                retry: false
              })
        ),
        catchError(err => {
          Sentry.addBreadcrumb({ message: 'epic grid profile report success' })
          Sentry.captureException(err)
          return of(GRID_PROFILE_DOWNLOAD_ERROR({ error: err, retry: true }))
        })
      )
    )
  )

export const gridProfileManageErrorsEpic = action$ =>
  action$.pipe(
    ofType(GRID_PROFILE_DOWNLOAD_ERROR.getType()),
    exhaustMap(({ payload: { retry, error } }) =>
      from(hasInternetConnection()).pipe(
        map(() => (retry ? GRID_PROFILE_DOWNLOAD_INIT(true) : EMPTY_ACTION())),
        catchError(err => {
          Sentry.addBreadcrumb({ message: 'GRID_PROFILE_DOWNLOAD_ERROR' })
          Sentry.captureException(err)
          return EMPTY
        })
      )
    )
  )

export default [
  initDownloadGridProfileEpic,
  gridProfileReportSuccessEpic,
  gridProfileManageErrorsEpic
]
