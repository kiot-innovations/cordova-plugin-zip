import { pathOr } from 'ramda'
import { ofType } from 'redux-observable'
import { from, of, EMPTY } from 'rxjs'
import {
  catchError,
  concatMap,
  exhaustMap,
  map,
  switchMap
} from 'rxjs/operators'

import {
  DOWNLOAD_ERROR,
  DOWNLOAD_INIT,
  DOWNLOAD_SUCCESS,
  FIRMWARE_METADATA_DOWNLOAD_INIT,
  FIRMWARE_GET_FILE_INFO,
  FIRMWARE_GET_FILE,
  GET_FILE_ERROR,
  SET_FILE_INFO,
  FIRMWARE_DOWNLOAD_LUA_FILES,
  SET_FILE_SIZE,
  FIRMWARE_DOWNLOAD_INIT
} from 'state/actions/fileDownloader'

import {
  getFileInfo,
  getFirmwareVersionData,
  getPVSFileSystemName,
  getLuaZipFileURL,
  parseLuaFile
} from 'shared/fileSystem'

/**
 * Init download of metadata file and sets file name for the UI
 * @param action$
 * @returns {*}
 */
export const epicGetFirmwareMetadataFile = action$ =>
  action$.pipe(
    ofType(FIRMWARE_METADATA_DOWNLOAD_INIT.getType()),
    switchMap(() =>
      from(getFirmwareVersionData()).pipe(
        switchMap(({ luaFileName, luaDownloadName, fileURL, version }) =>
          of(
            SET_FILE_INFO({
              displayName: `${luaFileName} - ${version}`,
              name: luaDownloadName
            }),
            DOWNLOAD_INIT({
              fileUrl: fileURL,
              folder: 'firmware',
              fileName: luaDownloadName
            })
          )
        ),
        catchError(() =>
          of(
            GET_FILE_ERROR({
              error: 'I ran into an error getting the PVS filename'
            })
          )
        )
      )
    )
  )

/**
 * This epic starts after lua file is downloaded
 * it triggers FIRMWARE_DOWNLOAD_INIT
 * @param action$
 * @returns {*}
 */
export const epicFirmwareMetadataFileDownloaded = action$ =>
  action$.pipe(
    ofType(DOWNLOAD_SUCCESS.getType(), DOWNLOAD_ERROR.getType()),
    switchMap(action =>
      from(getFirmwareVersionData()).pipe(
        concatMap(({ luaDownloadName }) =>
          pathOr('', ['payload', 'name'], action) === `${luaDownloadName}`
            ? of(FIRMWARE_DOWNLOAD_INIT())
            : EMPTY
        ),
        catchError(() =>
          of(
            GET_FILE_ERROR({
              error: 'I ran into an error getting the PVS filename'
            })
          )
        )
      )
    )
  )

/**
 * It triggers FIRMWARE_GET_FILE_INFO if file exists in the FS,
 * if it doesn't it triggers: FIRMWARE_GET_FILE_INFO
 * @param action$
 * @returns {*}
 */
export const epicFirmwareGetFile = action$ =>
  action$.pipe(
    ofType(FIRMWARE_GET_FILE.getType()),
    exhaustMap(() =>
      from(getPVSFileSystemName()).pipe(
        switchMap(fileName =>
          from(getFileInfo(fileName)).pipe(
            map(() => FIRMWARE_GET_FILE_INFO()),
            catchError(() => of(FIRMWARE_DOWNLOAD_INIT()))
          )
        ),
        catchError(() => of(FIRMWARE_DOWNLOAD_INIT()))
      )
    )
  )

/**
 * Gets File Info From metadata to display it on the screen
 * @param action$
 * @returns {*}
 */
export const epicFirmwareGetFileInfo = action$ =>
  action$.pipe(
    ofType(FIRMWARE_GET_FILE_INFO.getType()),
    switchMap(action =>
      from(getFirmwareVersionData()).pipe(
        switchMap(
          ({ luaFileName, version, pvsFileSystemName, luaDownloadName }) =>
            from(parseLuaFile(luaDownloadName)).pipe(
              switchMap(({ size }) =>
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
        ),
        catchError(() => of(FIRMWARE_METADATA_DOWNLOAD_INIT()))
      )
    )
  )

/**
 * Starts Downloading Firmware
 * It assumes lua metadata file exists, if it doesn't it triggers an error that
 * inits epicGetFirmwareMetadataFile
 * @param action$
 * @returns {*}
 */
export const epicFirmwareDownloadInit = action$ =>
  action$.pipe(
    ofType(FIRMWARE_DOWNLOAD_INIT.getType()),
    switchMap(action =>
      from(getFirmwareVersionData()).pipe(
        switchMap(
          ({ pvsFileSystemName, luaFileName, version, luaDownloadName }) =>
            from(parseLuaFile(luaDownloadName)).pipe(
              switchMap(({ size, fileUrl }) =>
                of(
                  SET_FILE_SIZE(size),
                  SET_FILE_INFO({
                    displayName: `${luaFileName} - ${version}`,
                    name: pvsFileSystemName
                  }),
                  DOWNLOAD_INIT({
                    fileUrl: fileUrl,
                    folder: 'firmware',
                    fileName: pvsFileSystemName,
                    wifiOnly: true
                  })
                )
              ),
              catchError(() => of(FIRMWARE_METADATA_DOWNLOAD_INIT()))
            )
        ),
        catchError(() => of(FIRMWARE_METADATA_DOWNLOAD_INIT()))
      )
    )
  )

/**
 * This epic starts after firmware file is downloaded
 * it triggers FIRMWARE_GET_FILE
 * @param action$
 * @returns {*}
 */
export const epicFirmwareFileDownloaded = action$ =>
  action$.pipe(
    ofType(DOWNLOAD_SUCCESS.getType(), DOWNLOAD_ERROR.getType()),
    switchMap(action =>
      from(getFirmwareVersionData()).pipe(
        concatMap(({ pvsFileSystemName, version }) =>
          pathOr('', ['payload', 'name'], action) === pvsFileSystemName
            ? of(FIRMWARE_DOWNLOAD_LUA_FILES(version))
            : EMPTY
        ),
        catchError(() =>
          of(
            GET_FILE_ERROR({
              error: 'I ran into an error getting the PVS filename'
            })
          )
        )
      )
    )
  )

/**
 * Starts Downloading lua files
 * inits epicGetFirmwareMetadataFile
 * @param action$
 * @returns {*}
 */
export const epicDownloadLuaFilesInit = action$ =>
  action$.pipe(
    ofType(FIRMWARE_DOWNLOAD_LUA_FILES.getType()),
    switchMap(action =>
      of(
        DOWNLOAD_INIT({
          fileUrl: getLuaZipFileURL(pathOr('', ['payload'], action)),
          unzip: true,
          folder: 'luaFiles'
        })
      )
    )
  )

export default [
  epicFirmwareGetFileInfo,
  epicGetFirmwareMetadataFile,
  epicFirmwareMetadataFileDownloaded,
  epicFirmwareGetFile,
  epicFirmwareDownloadInit,
  epicFirmwareFileDownloaded,
  epicDownloadLuaFilesInit
]
