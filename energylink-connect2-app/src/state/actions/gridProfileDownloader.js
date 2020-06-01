import { createAction } from 'redux-act'
export const GRID_PROFILE_DOWNLOAD_INIT = createAction(
  'GRID_PROFILE_DOWNLOAD_INIT'
)
export const GRID_PROFILE_DOWNLOAD_PROGRESS = createAction(
  'GRID_PROFILE_DOWNLOAD_PROGRESS'
)
export const GRID_PROFILE_DOWNLOAD_ERROR = createAction(
  'GRID_PROFILE_DOWNLOAD_ERROR'
)
export const GRID_PROFILE_DOWNLOAD_SUCCESS = createAction(
  'GRID_PROFILE_DOWNLOAD_SUCCESS'
)
export const GRID_PROFILE_GET_FILE = createAction('GRID_PROFILE_GET_FILE')
export const GRID_PROFILE_FILE_ERROR = createAction('GRID_PROFILE_FILE_ERROR')
export const GRID_PROFILE_SET_FILE_INFO = createAction(
  'GRID_PROFILE_SET_FILE_INFO'
)
