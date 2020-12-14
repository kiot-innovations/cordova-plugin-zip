import * as Sentry from '@sentry/browser'
import {
  always,
  curry,
  identity,
  ifElse,
  is,
  path,
  pathOr,
  propOr
} from 'ramda'
import { ofType } from 'redux-observable'
import { forkJoin, from, of } from 'rxjs'
import { catchError, exhaustMap, map } from 'rxjs/operators'

import fileTransferObservable from 'state/epics/observables/downloader'
import { checkMD5 } from 'shared/cordovaMapping'
import { getFileInfo } from 'shared/fileSystem'
import {
  essUpdateUrl$,
  waitForObservable
} from 'state/epics/downloader/latestUrls'
import {
  DOWNLOAD_OS_ERROR,
  DOWNLOAD_OS_INIT,
  DOWNLOAD_OS_PROGRESS,
  DOWNLOAD_OS_REPORT_SUCCESS,
  DOWNLOAD_OS_SUCCESS
} from 'state/actions/ess'
import { getVersionFromUrl } from 'shared/download'
import { DOWNLOAD_OS_UPDATE_VERSION } from 'state/actions/ess'

const downloadOSZipEpic = (action$, state$) => {
  const shouldRetry = ifElse(is(Boolean), identity, always(false))
  return action$.pipe(
    ofType(DOWNLOAD_OS_INIT.getType()),
    waitForObservable(essUpdateUrl$),
    exhaustMap(([action, updateUrl]) => {
      const filePath = 'ESS/EQS-FW-Package.zip'
      const payload = propOr(false, 'payload', action)
      return fileTransferObservable(
        filePath,
        updateUrl,
        shouldRetry(payload),
        pathOr('', ['value', 'user', 'auth', 'access_token'], state$),
        ['x-amz-meta-md5-hash', 'x-checksum-md5']
      ).pipe(
        map(({ entry, progress, total, serverHeaders, step }) =>
          progress
            ? DOWNLOAD_OS_PROGRESS({ progress, total, step })
            : DOWNLOAD_OS_REPORT_SUCCESS({ serverHeaders, entry, filePath })
        ),
        catchError(err => {
          Sentry.addBreadcrumb({
            data: {
              ...payload,
              baseUrl: process.env.REACT_APP_ARTIFACTORY_BASE,
              environment: process.env.REACT_APP_FLAVOR
            },
            category: 'ESS-Firmware-download',
            message: 'Failed to download ESS firmware',
            level: Sentry.Severity.Error
          })
          Sentry.captureException(err)
          return of(DOWNLOAD_OS_ERROR.asError(err))
        })
      )
    })
  )
}

const updateVersionEpic = action$ =>
  action$.pipe(
    ofType(DOWNLOAD_OS_INIT.getType()),
    waitForObservable(essUpdateUrl$),
    map(([, url]) => DOWNLOAD_OS_UPDATE_VERSION(getVersionFromUrl(url)))
  )

const getMd5 = curry((state, { serverHeaders = {} }) => {
  if (serverHeaders['x-amz-meta-md5-hash']) {
    return serverHeaders['x-amz-meta-md5-hash']
  } else if (serverHeaders['x-checksum-md5']) {
    return serverHeaders['x-checksum-md5']
  }
  return path(['value', 'ess', 'md5'], state)
})
const checkIntegrityESSDownload = (action$, state$) =>
  action$.pipe(
    ofType(DOWNLOAD_OS_REPORT_SUCCESS.getType()),
    exhaustMap(({ payload }) => {
      const { filePath, entry } = payload
      const md5 = getMd5(state$, payload)

      return forkJoin({
        md5: from(checkMD5(filePath, md5)),
        fileInfo: from(getFileInfo(filePath))
      }).pipe(
        map(({ fileInfo }) =>
          DOWNLOAD_OS_SUCCESS({
            entryFile: entry,
            total: fileInfo.size,
            lastModified: fileInfo.lastModified
          })
        ),
        catchError(err => {
          Sentry.addBreadcrumb({ message: `filePath ${filePath}` })
          Sentry.addBreadcrumb({ message: `expected md5 ${md5}` })
          Sentry.captureException(err)
          return of(DOWNLOAD_OS_ERROR.asError(err))
        })
      )
    })
  )

export default [downloadOSZipEpic, checkIntegrityESSDownload, updateVersionEpic]
