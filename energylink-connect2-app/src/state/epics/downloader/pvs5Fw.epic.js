import { join, path, pathEq } from 'ramda'
import { ofType } from 'redux-observable'
import { EMPTY, from, of } from 'rxjs'
import {
  catchError,
  exhaustMap,
  filter,
  map,
  switchMap,
  withLatestFrom
} from 'rxjs/operators'
import * as Sentry from 'sentry-cordova'

import {
  getPVS5FwVersionData,
  getPVS5LuaUrl,
  verifyPvS5SHA256
} from 'shared/fileSystem'
import {
  getPVS5FsUrlFromLuaFile,
  getPVS5ScriptsUrlFromLuaFile,
  getPVS5KernelUrlFromLuaFile
} from 'shared/PVSUtils'
import {
  PVS5_DECOMPRESS_LUA_FILES_INIT,
  PVS5_DECOMPRESS_LUA_FILES_SUCCESS,
  PVS5_FW_DOWNLOAD_ERROR,
  PVS5_FW_DOWNLOAD_INIT,
  PVS5_FW_DOWNLOAD_RESTART,
  PVS5_FW_DOWNLOAD_PROGRESS,
  PVS5_FW_DOWNLOAD_SUCCESS,
  PVS5_FW_VERIFY_DOWNLOAD,
  PVS5_SCRIPTS_DOWNLOAD_PROGRESS,
  PVS5_SCRIPTS_DOWNLOAD_SUCCESS,
  PVS5_SCRIPTS_DOWNLOAD_ERROR,
  PVS5_SCRIPTS_VERIFY_DOWNLOAD,
  PVS5_KERNEL_DOWNLOAD_PROGRESS,
  PVS5_KERNEL_DOWNLOAD_SUCCESS,
  PVS5_KERNEL_DOWNLOAD_ERROR,
  PVS5_KERNEL_VERIFY_DOWNLOAD,
  PVS5_SET_FW_INFO
} from 'state/actions/fileDownloader'
import {
  pvs5UpdateUrl$,
  waitForObservable
} from 'state/epics/downloader/latestUrls'
import fileTransferObservable from 'state/epics/observables/downloader'
import unzipObservable from 'state/epics/observables/unzip'

const sendErrorToSentry = (action, message) => error => {
  const prefix = 'An error ocurred while'
  const errorMessage = join(' ', [prefix, message])

  Sentry.captureMessage(errorMessage)
  Sentry.captureException(error)

  return of(action(errorMessage))
}

export const setInfoPVS5Epic = (action$, state$) =>
  action$.pipe(
    ofType(PVS5_FW_DOWNLOAD_INIT.getType()),
    waitForObservable(pvs5UpdateUrl$),
    filter(({ payload: forceDownload }) => {
      const status = path(
        ['value', 'fileDownloader', 'pvs5Fw', 'status'],
        state$
      )

      if (forceDownload) {
        return true
      }

      return status === 'idle' || status === 'downloaded' || status === 'error'
    }),
    exhaustMap(([action, updateURL]) => {
      const { versionName, buildNumber } = getPVS5FwVersionData(updateURL)
      const { payload: shouldRetry = false } = action

      return shouldRetry
        ? of(
            PVS5_FW_DOWNLOAD_RESTART({
              versionName,
              buildNumber,
              updateURL,
              shouldRetry
            })
          )
        : of(
            PVS5_SET_FW_INFO({
              versionName,
              buildNumber,
              updateURL,
              shouldRetry
            })
          )
    }),
    catchError(
      sendErrorToSentry(
        PVS5_FW_DOWNLOAD_ERROR,
        'downloading PVS5 firmware info'
      )
    )
  )

export const downloadPVS5FileSystemEpic = (action$, state$) =>
  action$.pipe(
    ofType(
      PVS5_DECOMPRESS_LUA_FILES_SUCCESS.getType(),
      PVS5_FW_DOWNLOAD_RESTART.getType()
    ),
    withLatestFrom(state$),
    exhaustMap(([{ payload }, state]) => {
      const url = path(['fileDownloader', 'pvs5Fw', 'updateURL'], state)
      const { pvsFileSystemName } = getPVS5FwVersionData(url)

      return fileTransferObservable({
        path: `firmware/${pvsFileSystemName}`,
        url: getPVS5FsUrlFromLuaFile(url),
        retry: payload.shouldRetry,
        fileExtensions: ['fs']
      }).pipe(
        switchMap(({ progress, total, step, entry }) => {
          if (entry) {
            return of(PVS5_FW_VERIFY_DOWNLOAD(`firmware/${pvsFileSystemName}`))
          }
          if (progress) {
            return of(
              PVS5_FW_DOWNLOAD_PROGRESS({
                progress,
                size: (total / 1000000).toFixed(2),
                step
              })
            )
          }
          return EMPTY
        }),
        catchError(
          sendErrorToSentry(
            PVS5_FW_DOWNLOAD_ERROR,
            'downloading PVS5 file system file'
          )
        )
      )
    })
  )

export const downloadPVS5ScriptsEpic = (action$, state$) =>
  action$.pipe(
    ofType(
      PVS5_DECOMPRESS_LUA_FILES_SUCCESS.getType(),
      PVS5_FW_DOWNLOAD_RESTART.getType()
    ),
    withLatestFrom(state$),
    exhaustMap(([{ payload }, state]) => {
      const url = path(['fileDownloader', 'pvs5Scripts', 'updateURL'], state)
      const { pvsScriptsName } = getPVS5FwVersionData(url)

      return fileTransferObservable({
        path: `firmware/${pvsScriptsName}`,
        url: getPVS5ScriptsUrlFromLuaFile(url),
        retry: payload.shouldRetry,
        fileExtensions: ['scripts']
      }).pipe(
        switchMap(({ progress, total, step, entry }) => {
          if (entry) {
            return of(
              PVS5_SCRIPTS_VERIFY_DOWNLOAD(`firmware/${pvsScriptsName}`)
            )
          }
          if (progress) {
            return of(
              PVS5_SCRIPTS_DOWNLOAD_PROGRESS({
                progress,
                size: (total / 1000000).toFixed(2),
                step
              })
            )
          }
          return EMPTY
        }),
        catchError(
          sendErrorToSentry(
            PVS5_SCRIPTS_DOWNLOAD_ERROR,
            'downloading PVS5 scripts file'
          )
        )
      )
    })
  )

export const downloadPVS5KernelEpic = (action$, state$) =>
  action$.pipe(
    ofType(
      PVS5_DECOMPRESS_LUA_FILES_SUCCESS.getType(),
      PVS5_FW_DOWNLOAD_RESTART.getType()
    ),
    withLatestFrom(state$),
    exhaustMap(([{ payload }, state]) => {
      const url = path(['fileDownloader', 'pvs5Kernel', 'updateURL'], state)
      const { pvsKernelName } = getPVS5FwVersionData(url)

      return fileTransferObservable({
        path: `firmware/${pvsKernelName}`,
        url: getPVS5KernelUrlFromLuaFile(url),
        retry: payload.shouldRetry,
        fileExtensions: ['kernel']
      }).pipe(
        switchMap(({ progress, total, step, entry }) => {
          if (entry) {
            return of(PVS5_KERNEL_VERIFY_DOWNLOAD(`firmware/${pvsKernelName}`))
          }
          if (progress) {
            return of(
              PVS5_KERNEL_DOWNLOAD_PROGRESS({
                progress,
                size: (total / 1000000).toFixed(2),
                step
              })
            )
          }
          return EMPTY
        }),
        catchError(
          sendErrorToSentry(
            PVS5_KERNEL_DOWNLOAD_ERROR,
            'downloading PVS5 kernel file'
          )
        )
      )
    })
  )

export const verifyPvs5FsDownloadEpic = (action$, state$) =>
  action$.pipe(
    ofType(PVS5_FW_VERIFY_DOWNLOAD.getType()),
    filter(() =>
      pathEq(
        ['value', 'fileDownloader', 'pvs5Fw', 'status'],
        'verifying',
        state$
      )
    ),
    exhaustMap(({ payload }) =>
      from(verifyPvS5SHA256(payload)).pipe(
        map(({ lastModified, size }) =>
          PVS5_FW_DOWNLOAD_SUCCESS({
            lastModified,
            size: (size / 1000000).toFixed(2)
          })
        ),
        catchError(
          sendErrorToSentry(
            PVS5_FW_DOWNLOAD_ERROR,
            'verifying PVS5 file system file hash'
          )
        )
      )
    )
  )

export const verifyPvs5ScriptsDownloadEpic = (action$, state$) =>
  action$.pipe(
    ofType(PVS5_SCRIPTS_VERIFY_DOWNLOAD.getType()),
    filter(() =>
      pathEq(
        ['value', 'fileDownloader', 'pvs5Scripts', 'status'],
        'verifying',
        state$
      )
    ),
    exhaustMap(({ payload }) =>
      from(verifyPvS5SHA256(payload)).pipe(
        map(({ lastModified, size }) =>
          PVS5_SCRIPTS_DOWNLOAD_SUCCESS({
            lastModified,
            size: (size / 1000000).toFixed(2)
          })
        ),
        catchError(
          sendErrorToSentry(
            PVS5_SCRIPTS_DOWNLOAD_ERROR,
            'verifying PVS5 scripts file hash'
          )
        )
      )
    )
  )

export const verifyPvs5KernelDownloadEpic = (action$, state$) =>
  action$.pipe(
    ofType(PVS5_KERNEL_VERIFY_DOWNLOAD.getType()),
    filter(() =>
      pathEq(
        ['value', 'fileDownloader', 'pvs5Kernel', 'status'],
        'verifying',
        state$
      )
    ),
    exhaustMap(({ payload }) =>
      from(verifyPvS5SHA256(payload)).pipe(
        map(({ lastModified, size }) =>
          PVS5_KERNEL_DOWNLOAD_SUCCESS({
            lastModified,
            size: (size / 1000000).toFixed(2)
          })
        ),
        catchError(
          sendErrorToSentry(
            PVS5_KERNEL_DOWNLOAD_ERROR,
            'verifying PVS5 kernel file hash'
          )
        )
      )
    )
  )

export const downloadPVS5LuaEpic = (action$, state$) =>
  action$.pipe(
    ofType(PVS5_SET_FW_INFO.getType()),
    filter(() =>
      pathEq(
        ['value', 'fileDownloader', 'pvs5Fw', 'status'],
        'downloading',
        state$
      )
    ),
    withLatestFrom(state$),
    exhaustMap(([{ shouldRetry }, state]) => {
      const url = path(['fileDownloader', 'pvs5Fw', 'updateURL'], state)
      return fileTransferObservable({
        path: 'pvs5-luaFiles/all.zip',
        url: getPVS5LuaUrl(url),
        retry: shouldRetry
      }).pipe(
        filter(({ entry }) => !!entry),
        map(() => PVS5_DECOMPRESS_LUA_FILES_INIT()),
        catchError(
          sendErrorToSentry(PVS5_FW_DOWNLOAD_ERROR, 'downloading lua zip file')
        )
      )
    })
  )

export const decompressPVS5LuaFiles = (action$, state$) =>
  action$.pipe(
    ofType(PVS5_DECOMPRESS_LUA_FILES_INIT.getType()),
    filter(() =>
      pathEq(
        ['value', 'fileDownloader', 'pvs5Fw', 'status'],
        'downloading',
        state$
      )
    ),
    exhaustMap(() =>
      unzipObservable('pvs5-luaFiles/all.zip').pipe(
        map(PVS5_DECOMPRESS_LUA_FILES_SUCCESS),
        catchError(
          sendErrorToSentry(
            PVS5_FW_DOWNLOAD_ERROR,
            'decompressing lua zip file'
          )
        )
      )
    )
  )

export default [
  downloadPVS5LuaEpic,
  setInfoPVS5Epic,
  decompressPVS5LuaFiles,
  downloadPVS5FileSystemEpic,
  downloadPVS5ScriptsEpic,
  downloadPVS5KernelEpic,
  verifyPvs5FsDownloadEpic,
  verifyPvs5ScriptsDownloadEpic,
  verifyPvs5KernelDownloadEpic
]
