import * as Sentry from '@sentry/browser'
import { propOr } from 'ramda'
import { ofType } from 'redux-observable'
import { from, of, EMPTY } from 'rxjs'
import { catchError, exhaustMap, map } from 'rxjs/operators'

import {
  fileExists,
  getFirmwareVersionData,
  getFS,
  readFile,
  verifySHA256
} from 'shared/fileSystem'
import { getFileSystemFromLuaFile } from 'shared/PVSUtils'
import { hasInternetConnection } from 'shared/utils'
import {
  PVS_DECOMPRESS_LUA_FILES_ERROR,
  PVS_DECOMPRESS_LUA_FILES_INIT,
  PVS_DECOMPRESS_LUA_FILES_SUCCESS,
  PVS_FIRMWARE_DOWNLOAD_ERROR,
  PVS_FIRMWARE_DOWNLOAD_INIT,
  PVS_FIRMWARE_DOWNLOAD_PROGRESS,
  PVS_FIRMWARE_DOWNLOAD_SUCCESS,
  PVS_FIRMWARE_REPORT_SUCCESS,
  PVS_FIRMWARE_UPDATE_URL,
  PVS_SET_FILE_INFO
} from 'state/actions/fileDownloader'
import {
  SET_FIRMWARE_RELEASE_NOTES,
  GET_RELEASE_NOTES_ERROR
} from 'state/actions/firmwareUpdate'
import { EMPTY_ACTION } from 'state/actions/share'
import {
  pvsUpdateUrl$,
  waitForObservable
} from 'state/epics/downloader/latestUrls'
import fileTransferObservable from 'state/epics/observables/downloader'
import unzipObservable from 'state/epics/observables/unzip'

export const updatePVSFirmwareUrl = action$ => {
  return action$.pipe(
    ofType(PVS_FIRMWARE_DOWNLOAD_INIT.getType()),
    waitForObservable(pvsUpdateUrl$),
    map(([action, url]) =>
      PVS_FIRMWARE_UPDATE_URL({
        url,
        shouldRetry: propOr(false, 'payload', action)
      })
    )
  )
}

export const downloadPVSFirmwareReleaseNotes = action$ =>
  action$.pipe(
    ofType(PVS_FIRMWARE_REPORT_SUCCESS.getType()),
    exhaustMap(({ payload }) => {
      //get the url, download the file, parse the firmware release notes out of it
      return from(
        readFile('luaFiles/fwup002.lua')
          .then(luaFileText => {
            const changes_urlRegex = /changes_url\s=\s\S*/gm

            function getChangesURL(regex, luaFile) {
              return regex
                .exec(luaFile)[0]
                .split(' = ')
                .pop()
                .split(',')
                .shift()
                .replaceAll("'", '')
            }

            return getChangesURL(changes_urlRegex, luaFileText)
          })
          .then(fetch)
          .then(res => res.json())
      ).pipe(
        map(SET_FIRMWARE_RELEASE_NOTES),
        catchError(err => {
          Sentry.captureException(err)
          return of(GET_RELEASE_NOTES_ERROR({ err: err.message }))
        })
      )
    })
  )

export const downloadPVSFirmware = action$ =>
  action$.pipe(
    ofType(PVS_FIRMWARE_UPDATE_URL.getType()),
    exhaustMap(({ payload }) => {
      const { shouldRetry, url } = payload
      const { fileURL, pvsFileSystemName } = getFirmwareVersionData(url)
      return fileTransferObservable({
        path: `firmware/${pvsFileSystemName}`,
        url: getFileSystemFromLuaFile(fileURL),
        retry: shouldRetry,
        fileExtensions: ['fs']
      }).pipe(
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
        catchError(err => {
          Sentry.addBreadcrumb({ message: 'PVS_FIRMWARE_DOWNLOAD_ERROR' })
          Sentry.captureException(err)
          return EMPTY
        })
      )
    })
  )

export const reportPVSDownloadSuccessEpic = action$ => {
  return action$.pipe(
    ofType(PVS_FIRMWARE_REPORT_SUCCESS.getType()),
    exhaustMap(({ payload }) =>
      from(verifySHA256(payload)).pipe(
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
      const { url, shouldRetry } = payload
      return fileTransferObservable({
        path: 'luaFiles/all.zip',
        url: getFS(url),
        retry: shouldRetry,
        fileExtensions: ['zip', 'lua']
      }).pipe(
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
  downloadPVSFirmwareReleaseNotes,
  updatePVSFirmwareUrl,
  downloadLuaFilesInitEpic,
  reportPVSDownloadSuccessEpic,
  setPVSFirmwareInfoData
]
