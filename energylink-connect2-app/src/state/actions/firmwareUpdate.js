import { createAction } from 'redux-act'

export const FIRMWARE_UPDATE_INIT = createAction('INIT FIRMWARE UPDATE')
export const FIRMWARE_SHOW_MODAL = createAction('SHOW MODAL FIRMWARE UPDATE')
export const RESET_FIRMWARE_UPDATE = createAction('RESET FIRMWARE UPDATE')
export const FIRMWARE_UPDATE_POLL_INIT = createAction(
  'FIRMWARE UPDATE START POLLING'
)
export const FIRMWARE_UPDATE_POLLING = createAction(
  'FIRMWARE UPDATE START POLLING'
)
export const FIRMWARE_UPDATE_POLL_STOP = createAction(
  'FIRMWARE UPDATE STOP POLLING STATUS'
)
export const FIRMWARE_UPDATE_WAITING_FOR_NETWORK = createAction(
  'FIRMWARE UPDATE WAITING NETWORK'
)
export const FIRMWARE_UPDATE_COMPLETE = createAction('COMPLETE FIRMWARE UPDATE')
export const FIRMWARE_UPDATE_ERROR = createAction('FIRMWARE UPDATE ERROR')
export const FIRMWARE_UPDATE_ERROR_NO_FILE = createAction(
  'FIRMWARE_UPDATE_ERROR_NO_FILE'
)
export const FIRMWARE_GET_VERSION_ERROR = createAction(
  'FIRMWARE_GET_VERSION_ERROR'
)
export const FIRMWARE_GET_VERSION_COMPLETE = createAction(
  'PVS  FW VERSION COMPLETE'
)
export const SET_FIRMWARE_RELEASE_NOTES = createAction(
  'SET_FIRMWARE_RELEASE_NOTES'
)
export const GET_RELEASE_NOTES_ERROR = createAction('GET_RELEASE_NOTES_ERROR')
export const FIRMWARE_SET_LAST_SUCCESSFUL_STAGE = createAction(
  'FIRMWARE_SET_LAST_SUCCESSFUL_STAGE'
)

export const GRID_PROFILE_UPLOAD_INIT = createAction('GRID_PROFILE_UPLOAD_INIT')
export const GRID_PROFILE_UPLOAD_COMPLETE = createAction(
  'GRID_PROFILE_UPLOAD_COMPLETE'
)
export const GRID_PROFILE_UPLOAD_ERROR = createAction(
  'GRID_PROFILE_UPLOAD_ERROR'
)
