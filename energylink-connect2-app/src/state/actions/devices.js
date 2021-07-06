import { createAction } from 'redux-act'

export const DISCOVER_INIT = createAction('DISCOVER_INIT')
export const DISCOVER_UPDATE = createAction('DISCOVER_UPDATE')
export const DISCOVER_COMPLETE = createAction('DISCOVER_COMPLETE')
export const DISCOVER_ERROR = createAction('DISCOVER_ERROR')
export const PUSH_CANDIDATES_INIT = createAction('PUSH_CANDIDATES_INIT')
export const PUSH_CANDIDATES_SUCCESS = createAction('PUSH_CANDIDATES_SUCCESS')
export const PUSH_CANDIDATES_ERROR = createAction('PUSH_CANDIDATES_ERROR')
export const FETCH_CANDIDATES_INIT = createAction('FETCH_CANDIDATES_INIT')
export const FETCH_CANDIDATES_UPDATE = createAction('FETCH_CANDIDATES_UPDATE')
export const FETCH_CANDIDATES_ERROR = createAction('FETCH_CANDIDATES_ERROR')
export const FETCH_CANDIDATES_COMPLETE = createAction(
  'FETCH_CANDIDATES_COMPLETE'
)
export const CLAIM_DEVICES_INIT = createAction('CLAIM_DEVICES_INIT')
export const CLAIM_DEVICES_SUCCESS = createAction('CLAIM_DEVICES_SUCCESS')
export const CLAIM_DEVICES_ERROR = createAction('CLAIM_DEVICES_ERROR')
export const CLAIM_DEVICES_UPDATE = createAction('CLAIM_DEVICES_UPDATE')
export const CLAIM_DEVICES_COMPLETE = createAction('CLAIM_COMPLETE')
export const CLAIM_DEVICES_RESET = createAction('CLAIM_DEVICES_RESET')

export const RESET_DISCOVERY = createAction('RESET_DISCOVERY')
export const RESET_DISCOVERY_PROGRESS = createAction('RESET_DISCOVERY_PROGRESS')

export const SAVE_OK_MI = createAction('SAVE_OK_MI')
export const FETCH_MODELS_INIT = createAction('FETCH_MODELS_INIT')
export const FETCH_MODELS_SUCCESS = createAction('FETCH_MODELS_SUCCESS')
export const FETCH_MODELS_ERROR = createAction('FETCH_MODELS_ERROR')
export const FETCH_MODELS_LOAD_DEFAULT = createAction(
  'FETCH_MODELS_LOAD_DEFAULT'
)

export const FETCH_DEVICES_LIST = createAction('FETCH_DEVICES_LIST')
export const UPDATE_DEVICES_LIST = createAction('UPDATE_DEVICES_LIST')
export const UPDATE_DEVICES_LIST_ERROR = createAction(
  'UPDATE_DEVICES_LIST_ERROR'
)
export const UPDATE_MI_MODELS = createAction('UPDATE_MI_MODELS')

export const WAIT_FOR_DEVICELIST_PROCESSING = createAction(
  'WAIT_FOR_DEVICELIST_PROCESSING'
)
export const DEVICELIST_PROCESSING_COMPLETE = createAction(
  'DEVICELIST_PROCESSING_COMPLETE'
)
export const DEVICELIST_PROCESSING_ERROR = createAction(
  'DEVICELIST_PROCESSING_ERROR'
)
