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
import { from, of } from 'rxjs'
import { catchError, exhaustMap, map } from 'rxjs/operators'
import { getEnvironment } from 'shared/utils'
import {
  DOWNLOAD_META_ERROR,
  DOWNLOAD_META_INIT,
  DOWNLOAD_META_SUCCESS,
  DOWNLOAD_OS_ERROR,
  DOWNLOAD_OS_INIT,
  DOWNLOAD_OS_PROGRESS,
  DOWNLOAD_OS_REPORT_SUCCESS,
  DOWNLOAD_OS_SUCCESS
} from 'state/actions/ess'

import fileTransferObservable from 'state/epics/observables/downloader'
import { checkMD5 } from 'shared/cordovaMapping'
import { PVS_FIRMWARE_MODAL_IS_CONNECTED } from 'state/actions/fileDownloader'
import { wifiCheckOperator } from './downloadOperators'

const downloadOSZipEpic = (action$, state$) => {
  const shouldRetry = ifElse(is(Boolean), identity, always(false))
  return action$.pipe(
    ofType(DOWNLOAD_OS_INIT.getType()),
    wifiCheckOperator(state$),
    exhaustMap(({ action, canDownload }) => {
      const filePath = 'ESS/EQS-FW-Package.zip'
      const payload = propOr(false, 'payload', action)
      return canDownload
        ? fileTransferObservable(
            filePath,
            `${process.env.REACT_APP_ARTIFACTORY_BASE}/pvs-connected-devices-firmware/chief_hopper/ChiefHopper.zip`,
            shouldRetry(payload),
            pathOr('', ['value', 'user', 'auth', 'access_token'], state$),
            ['x-checksum-md5']
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
                  environment: getEnvironment()
                },
                category: 'ESS-Firmware-download',
                message: 'Failed to download ESS firmware',
                level: Sentry.Severity.Error
              })
              Sentry.captureException(err)
              return of(DOWNLOAD_OS_ERROR.asError(err))
            })
          )
        : of(PVS_FIRMWARE_MODAL_IS_CONNECTED(action))
    })
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
const getMd5 = curry((state, payload) =>
  ifElse(
    path(['serverHeaders', 'x-checksum-md5']),
    path(['serverHeaders', 'x-checksum-md5']),
    () => path(['value', 'ess', 'md5'], state)
  )(payload)
)
const checkIntegrityESSDownload = (action$, state$) =>
  action$.pipe(
    ofType(DOWNLOAD_OS_REPORT_SUCCESS.getType()),
    exhaustMap(({ payload }) => {
      const { filePath, entry } = payload
      const md5 = getMd5(state$, payload)

      return from(checkMD5(filePath, md5)).pipe(
        map(() => DOWNLOAD_OS_SUCCESS(entry)),
        catchError(err => {
          Sentry.addBreadcrumb({ message: `filePath ${filePath}` })
          Sentry.addBreadcrumb({ message: `expected md5 ${md5}` })
          Sentry.captureException(err)
          return of(DOWNLOAD_OS_ERROR.asError(err))
        })
      )
    })
  )

export default [
  downloadMetaInformationEpic,
  downloadOSZipEpic,
  checkIntegrityESSDownload
]
