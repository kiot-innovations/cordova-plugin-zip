import { createAction } from 'redux-act'

export const FIRMWARE_UPDATE_INIT = createAction('INIT FIRMWARE UPDATE')
export const FIRMWARE_UPDATE_COMPLETE = createAction('COMPLETE FIRMWARE UPDATE')
export const FIRMWARE_UPDATE_ERROR = createAction('FIRMWARE UPDATE ERROR')
