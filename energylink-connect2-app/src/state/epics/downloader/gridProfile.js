import { propOr } from 'ramda'
import { from, of } from 'rxjs'
import { catchError, exhaustMap, map } from 'rxjs/operators'
import { ofType } from 'redux-observable'
import * as Sentry from '@sentry/browser'

import {
  GRID_PROFILE_DOWNLOAD_ERROR,
  GRID_PROFILE_DOWNLOAD_INIT,
  GRID_PROFILE_DOWNLOAD_PROGRESS,
  GRID_PROFILE_DOWNLOAD_SUCCESS,
  GRID_PROFILE_REPORT_SUCCESS
} from 'state/actions/gridProfileDownloader'
import { PVS_FIRMWARE_MODAL_IS_CONNECTED } from 'state/actions/fileDownloader'
import { getFileInfo, getGridProfileFileName } from 'shared/fileSystem'
import fileTransferObservable from 'state/epics/observables/downloader'
import { hasInternetConnection } from 'shared/utils'
import { modalNoInternet } from 'state/epics/downloader/firmware'
import { wifiCheckOperator } from './downloadOperators'

export const initDownloadGridProfileEpic = (action$, state$) =>
  action$.pipe(
    ofType(GRID_PROFILE_DOWNLOAD_INIT.getType()),
    wifiCheckOperator(state$),
    exhaustMap(({ action, canDownload }) =>
      canDownload
        ? fileTransferObservable(
            `firmware/${getGridProfileFileName()}`,
            process.env.REACT_APP_GRID_PROFILE_URL,
            propOr(false, 'payload', action)
          ).pipe(
            map(({ entry, progress }) =>
              progress
                ? GRID_PROFILE_DOWNLOAD_PROGRESS(progress)
                : GRID_PROFILE_REPORT_SUCCESS(`firmware/${entry.name}`)
            ),
            catchError(err => {
              Sentry.addBreadcrumb({ message: 'Downloading grid profile' })
              Sentry.captureException(err)
              return of(GRID_PROFILE_DOWNLOAD_ERROR(err))
            })
          )
        : of(PVS_FIRMWARE_MODAL_IS_CONNECTED(action))
    )
  )

export const gridProfileReportSuccessEpic = action$ =>
  action$.pipe(
    ofType(GRID_PROFILE_REPORT_SUCCESS.getType()),
    exhaustMap(({ payload }) =>
      from(getFileInfo(payload)).pipe(
        map(({ size, lastModified }) =>
          GRID_PROFILE_DOWNLOAD_SUCCESS({ size, lastModified })
        ),
        catchError(err => {
          Sentry.addBreadcrumb({ message: 'epic grid profile report success' })
          Sentry.captureException(err)
          return of(GRID_PROFILE_DOWNLOAD_ERROR(err))
        })
      )
    )
  )

export const gridProfileManageErrorsEpic = action$ =>
  action$.pipe(
    ofType(GRID_PROFILE_DOWNLOAD_ERROR.getType()),
    exhaustMap(({ payload }) => {
      return from(hasInternetConnection()).pipe(
        map(() => GRID_PROFILE_DOWNLOAD_INIT(true)),
        catchError(() => of(modalNoInternet()))
      )
    })
  )

export default [
  initDownloadGridProfileEpic,
  gridProfileReportSuccessEpic,
  gridProfileManageErrorsEpic
]
