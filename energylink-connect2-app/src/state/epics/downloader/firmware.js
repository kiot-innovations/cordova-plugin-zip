import { propOr } from 'ramda'
import { ofType } from 'redux-observable'
import * as Sentry from '@sentry/browser'
import { from, of } from 'rxjs'
import { catchError, exhaustMap, map } from 'rxjs/operators'

import {
  PVS_DECOMPRESS_LUA_FILES_ERROR,
  PVS_DECOMPRESS_LUA_FILES_INIT,
  PVS_DECOMPRESS_LUA_FILES_SUCCESS,
  PVS_FIRMWARE_DOWNLOAD_ERROR,
  PVS_FIRMWARE_DOWNLOAD_INIT,
  PVS_FIRMWARE_DOWNLOAD_PROGRESS,
  PVS_FIRMWARE_DOWNLOAD_SUCCESS,
  PVS_FIRMWARE_MODAL_IS_CONNECTED,
  PVS_FIRMWARE_REPORT_SUCCESS,
  PVS_FIRMWARE_UPDATE_URL,
  PVS_SET_FILE_INFO
} from 'state/actions/fileDownloader'
import { EMPTY_ACTION } from 'state/actions/share'
import unzipObservable from 'state/epics/observables/unzip'
import fileTransferObservable from 'state/epics/observables/downloader'
import {
  fileExists,
  getFirmwareVersionData,
  getFS,
  getLatestPVSFirmwareUrl,
  getLuaFileSize
} from 'shared/fileSystem'
import { getFileSystemFromLuaFile } from 'shared/PVSUtils'
import { getFirmwareUrlFromState } from 'state/epics/fimwareUpdate/checkVersionPVS'
import { hasInternetConnection } from 'shared/utils'
import { SHOW_MODAL } from 'state/actions/modal'
import { translate } from 'shared/i18n'
import { wifiCheckOperator } from './downloadOperators'

export const modalNoInternet = () => {
  const t = translate()
  return SHOW_MODAL({
    title: t('ATTENTION'),
    body: t('NO_INTERNET'),
    dismissable: true
  })
}

export const updatePVSFirmwareUrl = (action$, state$) => {
  return action$.pipe(
    ofType(PVS_FIRMWARE_DOWNLOAD_INIT.getType()),
    wifiCheckOperator(state$),
    exhaustMap(({ action, canDownload }) =>
      canDownload
        ? from(getLatestPVSFirmwareUrl()).pipe(
            map(url =>
              PVS_FIRMWARE_UPDATE_URL({
                url,
                shouldRetry: propOr(false, 'payload', action)
              })
            ),
            catchError(err => {
              Sentry.captureException(err)
              return of(
                PVS_FIRMWARE_UPDATE_URL({
                  url: getFirmwareUrlFromState(state$)
                })
              )
            })
          )
        : of(PVS_FIRMWARE_MODAL_IS_CONNECTED(action))
    )
  )
}

export const downloadPVSFirmware = action$ =>
  action$.pipe(
    ofType(PVS_FIRMWARE_UPDATE_URL.getType()),
    exhaustMap(({ payload }) => {
      const { shouldRetry, url } = payload
      const { fileURL, pvsFileSystemName } = getFirmwareVersionData(url)
      return fileTransferObservable(
        `firmware/${pvsFileSystemName}`,
        getFileSystemFromLuaFile(fileURL),
        shouldRetry
      ).pipe(
        map(({ progress, total, step }) =>
          progress
            ? PVS_FIRMWARE_DOWNLOAD_PROGRESS({
                progress,
                size: (total / 1000000).toFixed(2),
                step
              })
            : PVS_FIRMWARE_REPORT_SUCCESS(`firmware/${pvsFileSystemName}`)
        ),
        catchError(err => {
          Sentry.captureException(err)
          return of(PVS_FIRMWARE_DOWNLOAD_ERROR({ err: err.message, url }))
        })
      )
    })
  )

export const deleteFirmwareOnError = action$ =>
  action$.pipe(
    ofType(PVS_FIRMWARE_DOWNLOAD_ERROR.getType()),
    exhaustMap(({ payload }) => {
      return from(hasInternetConnection()).pipe(
        map(() => PVS_FIRMWARE_DOWNLOAD_INIT(true)),
        catchError(() => of(modalNoInternet()))
      )
    })
  )

export const reportPVSDownloadSuccessEpic = action$ => {
  return action$.pipe(
    ofType(PVS_FIRMWARE_REPORT_SUCCESS.getType()),
    exhaustMap(({ payload }) =>
      from(getLuaFileSize(payload)).pipe(
        map(({ lastModified, size }) =>
          PVS_FIRMWARE_DOWNLOAD_SUCCESS({
            lastModified,
            size: (size / 1000000).toFixed(2)
          })
        ),
        catchError(err => {
          Sentry.captureException(err)
          return of(PVS_FIRMWARE_DOWNLOAD_ERROR(err.message))
        })
      )
    )
  )
}

export const setPVSFirmwareInfoData = action$ =>
  action$.pipe(
    ofType(PVS_FIRMWARE_UPDATE_URL.getType()),
    map(({ payload }) => {
      const { url } = payload
      const {
        luaFileName,
        version,
        pvsFileSystemName
      } = getFirmwareVersionData(url)
      return PVS_SET_FILE_INFO({
        name: `firmware/${pvsFileSystemName}`,
        displayName: `${luaFileName} - ${version}`
      })
    })
  )

export const downloadLuaFilesInitEpic = action$ =>
  action$.pipe(
    ofType(PVS_FIRMWARE_UPDATE_URL.getType()),
    exhaustMap(({ payload }) => {
      const { url } = payload
      return fileTransferObservable('luaFiles/all.zip', getFS(url), true).pipe(
        map(({ progress }) =>
          progress
            ? EMPTY_ACTION('Downloading lua files')
            : PVS_DECOMPRESS_LUA_FILES_INIT()
        ),
        catchError(err => {
          const { code } = err
          //error code 3 network disconnection
          return code === 3
            ? fileExists('luaFiles/all.zip').then(file =>
                !file
                  ? PVS_FIRMWARE_DOWNLOAD_ERROR(
                      "The lua zip file doesn't exist"
                    )
                  : PVS_DECOMPRESS_LUA_FILES_INIT()
              )
            : of(PVS_FIRMWARE_DOWNLOAD_ERROR('LUA_ZIP_FILE_NOT_EXIST'))
        })
      )
    })
  )

export const decompressLuaFiles = action$ =>
  action$.pipe(
    ofType(PVS_DECOMPRESS_LUA_FILES_INIT.getType()),
    exhaustMap(() =>
      unzipObservable('luaFiles/all.zip').pipe(
        map(PVS_DECOMPRESS_LUA_FILES_SUCCESS),
        catchError(err => {
          Sentry.addBreadcrumb({ message: 'Decompressing lua files' })
          Sentry.captureException(err)
          return of(PVS_DECOMPRESS_LUA_FILES_ERROR(err))
        })
      )
    )
  )

export default [
  decompressLuaFiles,
  deleteFirmwareOnError,
  downloadPVSFirmware,
  updatePVSFirmwareUrl,
  downloadLuaFilesInitEpic,
  reportPVSDownloadSuccessEpic,
  setPVSFirmwareInfoData
]
