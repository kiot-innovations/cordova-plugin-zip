import * as Sentry from '@sentry/browser'
import { always, identity, ifElse, is, pathOr } from 'ramda'
import { ofType } from 'redux-observable'
import { from, Observable, of } from 'rxjs'
import { catchError, exhaustMap, map } from 'rxjs/operators'

import { fileExists } from 'shared/fileSystem'
import { getEnvironment, PERSIST_DATA_PATH } from 'shared/utils'
import {
  DOWNLOAD_META_ERROR,
  DOWNLOAD_META_INIT,
  DOWNLOAD_META_SUCCESS,
  DOWNLOAD_OS_ERROR,
  DOWNLOAD_OS_INIT,
  DOWNLOAD_OS_PROGRESS,
  DOWNLOAD_OS_SUCCESS
} from 'state/actions/ess'
import { DOWNLOAD_SUCCESS } from 'state/actions/fileDownloader'

const fileTransferObservable = (path, url, accessToken, retry = false) =>
  new Observable(subscriber => {
    const localFileUrl = `${PERSIST_DATA_PATH}ESS/${path}`
    const successCallback = entry => {
      subscriber.next({ entry })
      subscriber.complete()
    }
    const errorCallback = error => {
      subscriber.error({ ...error, url })
      subscriber.complete()
    }
    fileExists(localFileUrl).then(entry => {
      if (!entry || retry) {
        const fileTransfer = new window.FileTransfer()
        const uri = encodeURI(`${process.env.REACT_APP_ARTIFACTORY_BASE}${url}`)
        fileTransfer.onprogress = data => {
          const { loaded, total } = data
          const progress = ((loaded / total) * 100).toFixed(0)
          subscriber.next({ progress, total })
        }
        fileTransfer.download(
          uri,
          localFileUrl,
          successCallback,
          errorCallback,
          true,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        )
      } else successCallback(entry)
    })
  })

const downloadOSZipEpic = (action$, state$) => {
  const shouldRetry = ifElse(is(Boolean), identity, always(false))
  return action$.pipe(
    ofType(DOWNLOAD_OS_INIT.getType(), DOWNLOAD_SUCCESS.getType()),
    exhaustMap(({ payload = false }) =>
      fileTransferObservable(
        'EQS-FW-Package.zip',
        '/pvs-connected-devices-firmware/byers-2.1.0/Byers2.1.zip',
        pathOr('', ['value', 'user', 'auth', 'access_token'], state$),
        shouldRetry(payload)
      ).pipe(
        map(({ entry, progress, total }) =>
          progress
            ? DOWNLOAD_OS_PROGRESS({ progress, total })
            : DOWNLOAD_OS_SUCCESS(entry)
        ),
        catchError(err => {
          Sentry.addBreadcrumb({
            data: {
              ...payload,
              baseUrl: process.env.REACT_APP_ARTIFACTORY_BASE,
              environment: getEnvironment(),
              AT: pathOr('', ['value', 'user', 'auth', 'access_token'], state$)
            },
            category: 'ESS-Firmware-download',
            message: 'Failed to download ESS firmware',
            level: Sentry.Severity.Error
          })
          Sentry.captureException(err)
          return of(DOWNLOAD_OS_ERROR.asError(err))
        })
      )
    )
  )
}

async function getExternalFirmwareMeta(accessToken) {
  const myHeaders = new Headers()
  myHeaders.append('Authorization', `Bearer ${accessToken}`)

  const requestOptions = {
    method: 'GET',
    headers: myHeaders
  }

  const res = await fetch(
    `${process.env.REACT_APP_ARTIFACTORY_BASE}/pvs-connected-devices-firmware/dists/byers-2.1.0/external-firmware-meta.json`,
    requestOptions
  )
  return await res.json()
}

const downloadMetaInformationEpic = (action$, state$) =>
  action$.pipe(
    ofType(DOWNLOAD_META_INIT.getType()),
    exhaustMap(() =>
      from(
        getExternalFirmwareMeta(
          pathOr('', ['value', 'user', 'auth', 'access_token'], state$)
        )
      ).pipe(
        map(DOWNLOAD_META_SUCCESS),
        catchError(err => of(DOWNLOAD_META_ERROR(err)))
      )
    )
  )

export default [downloadMetaInformationEpic, downloadOSZipEpic]
