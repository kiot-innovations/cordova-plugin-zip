import { createAction } from 'redux-act'

export const SET_FILE_INFO = createAction('SET FILE INFO')

export const DOWNLOAD_PROGRESS = createAction('UPDATE DOWNLOAD PROGRESS')
export const DOWNLOAD_ABORT = createAction('DOWNLOAD_ABORT')
export const DOWNLOAD_FINISHED = createAction('DOWNLOAD FINISHED')
export const DOWNLOAD_SUCCESS = createAction('DOWNLOAD SUCCESS')
export const DOWNLOAD_ERROR = createAction('DOWNLOAD ERROR')
export const DOWNLOAD_NO_WIFI = createAction('NO WIFI')
export const DOWNLOAD_INIT = createAction('DOWNLOAD_INIT')
export const SET_FILE_SIZE = createAction('SET DOWNLOAD SIZE')
export const FIRMWARE_DOWNLOAD_INIT = createAction('FIRMWARE_DOWNLOAD_INIT')
export const FIRMWARE_METADATA_DOWNLOAD_INIT = createAction(
  'FIRMWARE_METADATA_DOWNLOAD_INIT'
)
export const FIRMWARE_DOWNLOADED = createAction('FIRMWARE_DOWNLOADED')
export const FIRMWARE_GET_FILE = createAction('FIRMWARE_GET_FILE')
export const FIRMWARE_GET_FILE_INFO = createAction('FIRMWARE_GET_FILE_INFO')
export const FIRMWARE_DOWNLOAD_LUA_FILES = createAction(
  'FIRMWARE_DOWNLOAD_LUA_FILES'
)
export const GET_FIRMWARE_URL = createAction('GET_FIRMWARE_URL')
export const GET_FIRMWARE_URL_ERROR = createAction('GET_FIRMWARE_URL_ERROR')
export const GET_FIRMWARE_URL_SUCCESS = createAction('GET_FIRMWARE_URL_SUCCESS')
