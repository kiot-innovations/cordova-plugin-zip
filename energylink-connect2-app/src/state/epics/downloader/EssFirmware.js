import { compose, head, multiply, pathOr, split, toString } from 'ramda'
import { ofType } from 'redux-observable'
import { from, Observable, of } from 'rxjs'
import { catchError, exhaustMap, map } from 'rxjs/operators'
import {
  DOWNLOAD_META_ERROR,
  DOWNLOAD_META_INIT,
  DOWNLOAD_META_SUCCESS,
  DOWNLOAD_OS_ERROR,
  DOWNLOAD_OS_INIT,
  DOWNLOAD_OS_PROGRESS,
  DOWNLOAD_OS_SUCCESS
} from 'state/actions/ess'

const getPercentLoaded = (loaded = 0, total = 0) => {
  const percent = Number.parseFloat(loaded / total).toFixed(2)

  return compose(head, split('.'), toString, multiply(100))(percent)
}

const fileTransferObservable = (path, url, accessToken) =>
  new Observable(subscriber => {
    const fileTransfer = new window.FileTransfer()
    const uri = encodeURI(`${process.env.REACT_APP_ARTIFACTORY_BASE}${url}`)
    fileTransfer.onprogress = ({ loaded, total }) => {
      const percent = getPercentLoaded(loaded, total)
      subscriber.next({ percent })
    }
    const successCallback = entry => {
      subscriber.next({ entry })
      subscriber.complete()
    }
    const errorCallback = error => {
      subscriber.error(error)
      subscriber.complete()
    }

    fileTransfer.download(
      uri,
      `cdvfile://localhost/persistent/ESS/${path}`,
      successCallback,
      errorCallback,
      true,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    )
  })

const downloadOSZipEpic = (action$, state$) =>
  action$.pipe(
    ofType(DOWNLOAD_OS_INIT.getType()),
    exhaustMap(() =>
      fileTransferObservable(
        'EQS-FW-Package.zip',
        'byers-1.0.0/Byers1.zip',
        pathOr('', ['value', 'user', 'auth', 'access_token'], state$)
      ).pipe(
        map(({ entry, percent }) => {
          if (percent) return DOWNLOAD_OS_PROGRESS(percent)
          return DOWNLOAD_OS_SUCCESS(entry)
        }),
        catchError(err => {
          console.warn(err)
          return of(DOWNLOAD_OS_ERROR.asError(err))
        })
      )
    )
  )

async function getExternalFirmwareMeta(accessToken) {
  const myHeaders = new Headers()
  myHeaders.append('Authorization', `Bearer ${accessToken}`)

  const requestOptions = {
    method: 'GET',
    headers: myHeaders
  }

  const res = await fetch(
    `${process.env.REACT_APP_ARTIFACTORY_BASE}dists/byers-1.0.0/external-firmware-meta.json`,
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
