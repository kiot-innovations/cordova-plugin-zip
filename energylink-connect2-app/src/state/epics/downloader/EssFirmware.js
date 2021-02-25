import * as Sentry from '@sentry/browser'
import {
  always,
  compose,
  filter,
  head,
  identity,
  ifElse,
  is,
  pathOr,
  propOr,
  props
} from 'ramda'
import { ofType } from 'redux-observable'
import { forkJoin, from, of } from 'rxjs'
import { catchError, exhaustMap, map } from 'rxjs/operators'

import fileTransferObservable from 'state/epics/observables/downloader'
import { getMd5FromFile } from 'shared/cordovaMapping'
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
import { getVersionFromUrl, getValidFileName } from 'shared/download'
import { DOWNLOAD_OS_UPDATE_VERSION } from 'state/actions/ess'
import { headersToObj, getAccessToken } from 'shared/utils'

const downloadOSZipEpic = (action$, state$) => {
  const shouldRetry = ifElse(is(Boolean), identity, always(false))
  return action$.pipe(
    ofType(DOWNLOAD_OS_INIT.getType()),
    waitForObservable(essUpdateUrl$),
    exhaustMap(([action, updateUrl]) => {
      const filePath = `ESS/${getValidFileName(updateUrl)}.zip`
      const payload = propOr(false, 'payload', action)
      return fileTransferObservable({
        path: filePath,
        url: updateUrl,
        retry: shouldRetry(payload),
        accessToken: getAccessToken(state$.value),
        headers: ['x-amz-meta-md5-hash', 'x-checksum-md5'],
        fileExtention: 'zip'
      }).pipe(
        map(({ entry, progress, total, serverHeaders, step }) =>
          progress
            ? DOWNLOAD_OS_PROGRESS({ progress, total, step })
            : DOWNLOAD_OS_REPORT_SUCCESS({
                serverHeaders,
                entry,
                filePath,
                updateUrl
              })
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

const checkMD5WithHead = (updateUrl, filePath, accessToken) =>
  new Promise((resolve, reject) =>
    Promise.all([
      getMd5FromFile(filePath),
      fetch(updateUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
        method: 'HEAD'
      })
    ])
      .then(([fileMd5, fetchResponse]) => {
        const getExpectedMD5 = compose(
          head,
          filter(Boolean),
          props(['x-checksum-md5', 'x-amz-meta-md5-hash']),
          headersToObj
        )

        const expectedMd5 = getExpectedMD5(fetchResponse.headers)

        if (expectedMd5 === fileMd5) resolve(expectedMd5)
        reject({
          message: 'MD5 not the same',
          serverMd5: expectedMd5,
          fileMd5,
          responseHeaders: headersToObj(fetchResponse.headers)
        })
      })
      .catch(reject)
  )

const checkIntegrityESSDownload = (action$, state$) =>
  action$.pipe(
    ofType(DOWNLOAD_OS_REPORT_SUCCESS.getType()),
    exhaustMap(({ payload }) => {
      const { serverHeaders, entry, filePath, updateUrl } = payload

      return forkJoin({
        md5: checkMD5WithHead(
          updateUrl,
          filePath,
          pathOr('', ['value', 'user', 'auth', 'access_token'], state$)
        ),
        fileInfo: from(getFileInfo(filePath))
      }).pipe(
        map(({ fileInfo, md5 }) =>
          DOWNLOAD_OS_SUCCESS({
            entryFile: entry,
            md5,
            total: fileInfo.size,
            lastModified: fileInfo.lastModified
          })
        ),
        catchError(err => {
          if (err instanceof Error) {
            Sentry.captureException(err)
          } else {
            Sentry.addBreadcrumb({
              message: 'Dealer info',
              data: {
                name: pathOr(
                  'N/A',
                  ['value', 'user', 'data', 'dealerName'],
                  state$
                )
              }
            })
            Sentry.addBreadcrumb({
              message: 'Additional info',
              data: { ...err, serverHeaders, filePath }
            })
            Sentry.addBreadcrumb({
              message: 'Server Headers',
              data: { ...err.responseHeaders }
            })
            Sentry.captureException(new Error('ESS file download error'))
          }
          return of(DOWNLOAD_OS_ERROR.asError(err))
        })
      )
    })
  )

export default [downloadOSZipEpic, checkIntegrityESSDownload, updateVersionEpic]
