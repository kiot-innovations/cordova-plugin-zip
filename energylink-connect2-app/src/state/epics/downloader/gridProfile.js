import { propOr } from 'ramda'
import { ofType } from 'redux-observable'
import { forkJoin, from, of, EMPTY } from 'rxjs'
import { catchError, exhaustMap, map, withLatestFrom } from 'rxjs/operators'
import * as Sentry from 'sentry-cordova'

import {
  pvs6GridProfileUpdateUrl$,
  pvs5GridProfileUpdateUrl$,
  waitForObservable
} from './latestUrls'

import { getMd5FromFile } from 'shared/cordovaMapping'
import { ERROR_CODES, getFileInfo, getFileNameFromURL } from 'shared/fileSystem'
import { getExpectedMD5, hasInternetConnection, TAGS } from 'shared/utils'
import {
  PVS6_GRID_PROFILE_DOWNLOAD_INIT,
  PVS6_GRID_PROFILE_DOWNLOAD_PROGRESS,
  PVS6_GRID_PROFILE_DOWNLOAD_SUCCESS,
  PVS6_GRID_PROFILE_REPORT_SUCCESS,
  PVS6_GRID_PROFILE_DOWNLOAD_ERROR,
  PVS5_GRID_PROFILE_DOWNLOAD_INIT,
  PVS5_GRID_PROFILE_DOWNLOAD_PROGRESS,
  PVS5_GRID_PROFILE_DOWNLOAD_SUCCESS,
  PVS5_GRID_PROFILE_REPORT_SUCCESS,
  PVS5_GRID_PROFILE_DOWNLOAD_ERROR
} from 'state/actions/gridProfileDownloader'
import { EMPTY_ACTION } from 'state/actions/share'
import fileTransferObservable from 'state/epics/observables/downloader'

export const initDownloadPvs6GridProfileEpic = action$ =>
  action$.pipe(
    ofType(PVS6_GRID_PROFILE_DOWNLOAD_INIT.getType()),
    waitForObservable(pvs6GridProfileUpdateUrl$), // Download won't start until the observable contains a value
    exhaustMap(([action, gridProfileUrl]) =>
      fileTransferObservable({
        path: `firmware/pvs6-${getFileNameFromURL(gridProfileUrl)}`,
        url: gridProfileUrl,
        retry: propOr(false, 'payload', action),
        fileExtensions: ['gz']
      }).pipe(
        map(({ entry, progress }) =>
          progress
            ? PVS6_GRID_PROFILE_DOWNLOAD_PROGRESS(progress)
            : PVS6_GRID_PROFILE_REPORT_SUCCESS(`firmware/${entry.name}`)
        ),
        catchError(err => {
          Sentry.addBreadcrumb({
            message: 'Error occurred while downloading grid profiles for PVS6'
          })
          Sentry.setTag(TAGS.KEY.GRID_PROFILES, TAGS.VALUE.DOWNLOADER_PVS6_GP)
          Sentry.captureException(err)
          return of(PVS6_GRID_PROFILE_DOWNLOAD_ERROR(err))
        })
      )
    )
  )

export const initDownloadPvs5GridProfileEpic = action$ =>
  action$.pipe(
    ofType(PVS5_GRID_PROFILE_DOWNLOAD_INIT.getType()),
    waitForObservable(pvs5GridProfileUpdateUrl$), // Download won't start until the observable contains a value
    exhaustMap(([action, gridProfileUrl]) =>
      fileTransferObservable({
        path: `firmware/pvs5-${getFileNameFromURL(gridProfileUrl)}`,
        url: gridProfileUrl,
        retry: propOr(false, 'payload', action),
        fileExtensions: ['gz']
      }).pipe(
        map(({ entry, progress }) =>
          progress
            ? PVS5_GRID_PROFILE_DOWNLOAD_PROGRESS(progress)
            : PVS5_GRID_PROFILE_REPORT_SUCCESS(`firmware/${entry.name}`)
        ),
        catchError(err => {
          Sentry.addBreadcrumb({
            message: 'Error occurred while downloading grid profiles for PVS5'
          })
          Sentry.setTag(TAGS.KEY.GRID_PROFILES, TAGS.VALUE.DOWNLOADER_PVS5_GP)
          Sentry.captureException(err)
          return of(
            PVS5_GRID_PROFILE_DOWNLOAD_ERROR({ error: err, retry: false })
          )
        })
      )
    )
  )

export const pvs6GridProfileReportSuccessEpic = action$ =>
  action$.pipe(
    ofType(PVS6_GRID_PROFILE_REPORT_SUCCESS.getType()),
    withLatestFrom(pvs6GridProfileUpdateUrl$),
    exhaustMap(([{ payload }, gridProfileURl]) =>
      forkJoin([
        from(getFileInfo(payload)),
        from(getMd5FromFile(payload)),
        from(getExpectedMD5(gridProfileURl))
      ]).pipe(
        map(([{ size, lastModified }, fileMd5, expectedMd5]) =>
          fileMd5 === expectedMd5
            ? PVS6_GRID_PROFILE_DOWNLOAD_SUCCESS({ size, lastModified })
            : PVS6_GRID_PROFILE_DOWNLOAD_ERROR({
                error: ERROR_CODES.MD5_NOT_MATCHING,
                retry: false
              })
        ),
        catchError(err => {
          Sentry.addBreadcrumb({
            message: 'Error occurred while verifying grid profiles for PVS6'
          })
          Sentry.setTag(TAGS.KEY.GRID_PROFILES, TAGS.VALUE.DOWNLOADER_PVS6_VGP)
          Sentry.captureException(err)
          return of(
            PVS6_GRID_PROFILE_DOWNLOAD_ERROR({ error: err, retry: true })
          )
        })
      )
    )
  )

export const pvs5GridProfileReportSuccessEpic = action$ =>
  action$.pipe(
    ofType(PVS5_GRID_PROFILE_REPORT_SUCCESS.getType()),
    withLatestFrom(pvs5GridProfileUpdateUrl$),
    exhaustMap(([{ payload }, gridProfileURl]) =>
      forkJoin([
        from(getFileInfo(payload)),
        from(getMd5FromFile(payload)),
        from(getExpectedMD5(gridProfileURl))
      ]).pipe(
        map(([{ size, lastModified }, fileMd5, expectedMd5]) =>
          fileMd5 === expectedMd5
            ? PVS5_GRID_PROFILE_DOWNLOAD_SUCCESS({ size, lastModified })
            : PVS5_GRID_PROFILE_DOWNLOAD_ERROR({
                error: ERROR_CODES.MD5_NOT_MATCHING,
                retry: false
              })
        ),
        catchError(err => {
          Sentry.addBreadcrumb({
            message: 'Error occurred while verifying grid profiles for PVS5'
          })
          Sentry.setTag(TAGS.KEY.GRID_PROFILES, TAGS.VALUE.DOWNLOADER_PVS6_VGP)
          Sentry.captureException(err)
          return of(
            PVS5_GRID_PROFILE_DOWNLOAD_ERROR({ error: err, retry: true })
          )
        })
      )
    )
  )

export const pvs6GridProfileManageErrorsEpic = action$ =>
  action$.pipe(
    ofType(PVS6_GRID_PROFILE_DOWNLOAD_ERROR.getType()),
    exhaustMap(({ payload: { retry, error } }) =>
      from(hasInternetConnection()).pipe(
        map(() =>
          retry ? PVS6_GRID_PROFILE_DOWNLOAD_INIT(true) : EMPTY_ACTION()
        ),
        catchError(err => {
          Sentry.addBreadcrumb({
            message: 'Error downloading grid profiles for PVS6'
          })
          Sentry.captureException(err)
          return EMPTY
        })
      )
    )
  )

export const pvs5GridProfileManageErrorsEpic = action$ =>
  action$.pipe(
    ofType(PVS5_GRID_PROFILE_DOWNLOAD_ERROR.getType()),
    exhaustMap(({ payload: { retry, error } }) =>
      from(hasInternetConnection()).pipe(
        map(() =>
          retry ? PVS5_GRID_PROFILE_DOWNLOAD_INIT(true) : EMPTY_ACTION()
        ),
        catchError(err => {
          Sentry.addBreadcrumb({
            message: 'Error downloading grid profiles for PVS5'
          })
          Sentry.captureException(err)
          return EMPTY
        })
      )
    )
  )

export default [
  initDownloadPvs6GridProfileEpic,
  initDownloadPvs5GridProfileEpic,
  pvs6GridProfileReportSuccessEpic,
  pvs5GridProfileReportSuccessEpic,
  pvs6GridProfileManageErrorsEpic,
  pvs5GridProfileManageErrorsEpic
]
