import { path, pathOr } from 'ramda'
import * as Sentry from '@sentry/browser'
import { ofType } from 'redux-observable'
import { EMPTY, from, of } from 'rxjs'
import {
  catchError,
  concatMap,
  exhaustMap,
  map,
  switchMap
} from 'rxjs/operators'

import {
  fileExists,
  getFirmwareVersionData,
  getFS,
  getPVSFileSystemName,
  parseLuaFile
} from 'shared/fileSystem'
import { getFileSystemFromLuaFile } from 'shared/PVSUtils'

import {
  DOWNLOAD_ERROR,
  DOWNLOAD_INIT,
  DOWNLOAD_SUCCESS,
  FIRMWARE_DOWNLOAD_INIT,
  FIRMWARE_DOWNLOAD_LUA_FILES,
  FIRMWARE_DOWNLOADED,
  FIRMWARE_GET_FILE,
  FIRMWARE_GET_FILE_INFO,
  FIRMWARE_METADATA_DOWNLOAD_INIT,
  GET_FIRMWARE_URL,
  GET_FIRMWARE_URL_ERROR,
  GET_FIRMWARE_URL_SUCCESS,
  SET_FILE_INFO,
  SET_FILE_SIZE
} from 'state/actions/fileDownloader'
import { EMPTY_ACTION } from 'state/actions/share'
import { PERSIST_DATA_PATH } from 'shared/utils'

export const getFirmwareUrlFromState = path([
  'value',
  'fileDownloader',
  'fileInfo',
  'updateURL'
])

async function getLatestCylonUrl() {
  const res = await fetch(process.env.REACT_APP_LATEST_FIRMWARE_URL)
  return await res.text()
}

export const epicGetLatestFirmwareURL = action$ => {
  return action$.pipe(
    ofType(GET_FIRMWARE_URL.getType()),
    switchMap(() =>
      from(getLatestCylonUrl()).pipe(
        switchMap(url =>
          of(GET_FIRMWARE_URL_SUCCESS(url), FIRMWARE_GET_FILE())
        ),
        catchError(err => {
          Sentry.captureException(err)
          return GET_FIRMWARE_URL_ERROR(err.message)
        })
      )
    )
  )
}

/**
 * Init download of metadata file and sets file name for the UI
 * @param action$
 * @param state$
 * @returns {*}
 */
export const epicGetFirmwareMetadataFile = (action$, state$) =>
  action$.pipe(
    ofType(
      FIRMWARE_METADATA_DOWNLOAD_INIT.getType(),
      GET_FIRMWARE_URL_SUCCESS.getType()
    ),
    switchMap(() => {
      const {
        luaFileName,
        luaDownloadName,
        fileURL,
        version
      } = getFirmwareVersionData(getFirmwareUrlFromState(state$))
      return of(
        SET_FILE_INFO({
          displayName: `${luaFileName} - ${version}`,
          name: luaDownloadName,
          exists: false
        }),
        DOWNLOAD_INIT({
          fileUrl: fileURL,
          folder: 'firmware',
          fileName: luaDownloadName
        })
      )
    })
  )

/**
 * This epic starts after lua file is downloaded
 * it triggers FIRMWARE_DOWNLOAD_INIT
 * @param action$
 * @param state$
 * @returns {*}
 */
export const epicFirmwareMetadataFileDownloaded = (action$, state$) =>
  action$.pipe(
    ofType(DOWNLOAD_SUCCESS.getType(), DOWNLOAD_ERROR.getType()),
    map(action => {
      const { luaDownloadName } = getFirmwareVersionData(
        getFirmwareUrlFromState(state$)
      )
      return pathOr('', ['payload', 'name'], action) === `${luaDownloadName}`
        ? FIRMWARE_DOWNLOAD_INIT()
        : EMPTY_ACTION()
    })
  )

/**
 * It triggers FIRMWARE_GET_FILE_INFO if file exists in the FS,
 * if it doesn't it triggers: FIRMWARE_GET_FILE_INFO
 * @param action$
 * @param state$
 * @returns {*}
 */
export const epicFirmwareGetFile = (action$, state$) =>
  action$.pipe(
    ofType(FIRMWARE_GET_FILE.getType()),
    exhaustMap(action => {
      const fileName = getPVSFileSystemName(getFirmwareUrlFromState(state$))
      return from(fileExists(`${PERSIST_DATA_PATH}${fileName}`)).pipe(
        switchMap(() =>
          of(SET_FILE_INFO({ exists: true }), FIRMWARE_GET_FILE_INFO())
        ),
        catchError(() =>
          of(
            FIRMWARE_DOWNLOAD_INIT({
              wifiOnly: pathOr(false, ['payload', 'wifiOnly'], action)
            })
          )
        )
      )
    })
  )

/**
 * Gets File Info From metadata to display it on the screen
 * @param action$
 * @param state$
 * @returns {*}
 */
export const epicFirmwareGetFileInfo = (action$, state$) =>
  action$.pipe(
    ofType(FIRMWARE_GET_FILE_INFO.getType()),
    switchMap(() => {
      const {
        luaFileName,
        version,
        pvsFileSystemName,
        luaDownloadName
      } = getFirmwareVersionData(getFirmwareUrlFromState(state$))
      return from(parseLuaFile(luaDownloadName)).pipe(
        switchMap(size =>
          of(
            SET_FILE_SIZE(size),
            SET_FILE_INFO({
              displayName: `${luaFileName} - ${version}`,
              name: pvsFileSystemName
            })
          )
        ),
        catchError(() => of(FIRMWARE_METADATA_DOWNLOAD_INIT()))
      )
    })
  )

/**
 * Starts Downloading Firmware
 * It assumes lua metadata file exists, if it doesn't it triggers an error that
 * inits epicGetFirmwareMetadataFile
 * @param action$
 * @param state$
 * @returns {*}
 */
export const epicFirmwareDownloadInit = (action$, state$) =>
  action$.pipe(
    ofType(FIRMWARE_DOWNLOAD_INIT.getType()),
    concatMap(action => {
      const {
        pvsFileSystemName,
        luaFileName,
        version,
        luaDownloadName,
        fileURL
      } = getFirmwareVersionData(getFirmwareUrlFromState(state$))
      return from(parseLuaFile(luaDownloadName)).pipe(
        switchMap(size =>
          of(
            SET_FILE_SIZE(size),
            SET_FILE_INFO({
              displayName: `${luaFileName} - ${version}`,
              name: pvsFileSystemName,
              exists: false
            }),
            DOWNLOAD_INIT({
              fileUrl: getFileSystemFromLuaFile(fileURL),
              folder: 'firmware',
              fileName: pvsFileSystemName,
              wifiOnly: pathOr(false, ['payload', 'wifiOnly'], action)
            })
          )
        ),
        catchError(() => of(FIRMWARE_METADATA_DOWNLOAD_INIT()))
      )
    })
  )

/**
 * This epic starts after firmware file is downloaded
 * it triggers FIRMWARE_GET_FILE
 * @param action$
 * @param state$
 * @returns {*}
 */
export const epicFirmwareFileDownloaded = (action$, state$) =>
  action$.pipe(
    ofType(DOWNLOAD_SUCCESS.getType(), DOWNLOAD_ERROR.getType()),
    switchMap(action => {
      const { pvsFileSystemName, version } = getFirmwareVersionData(
        getFirmwareUrlFromState(state$)
      )
      return pathOr('', ['payload', 'name'], action) === pvsFileSystemName
        ? of(FIRMWARE_DOWNLOAD_LUA_FILES(version), FIRMWARE_DOWNLOADED())
        : EMPTY
    })
  )

/**
 * Starts Downloading lua files
 * inits epicGetFirmwareMetadataFile
 * @param action$
 * @param state$
 * @returns {*}
 */
export const epicDownloadLuaFilesInit = (action$, state$) =>
  action$.pipe(
    ofType(FIRMWARE_DOWNLOAD_LUA_FILES.getType()),
    switchMap(() =>
      of(
        DOWNLOAD_INIT({
          fileUrl: getFS(getFirmwareUrlFromState(state$)),
          unzip: true,
          folder: 'luaFiles'
        })
      )
    )
  )

export default [
  epicGetLatestFirmwareURL,
  epicFirmwareGetFileInfo,
  epicGetFirmwareMetadataFile,
  epicFirmwareMetadataFileDownloaded,
  epicFirmwareGetFile,
  epicFirmwareDownloadInit,
  epicFirmwareFileDownloaded,
  epicDownloadLuaFilesInit
]
