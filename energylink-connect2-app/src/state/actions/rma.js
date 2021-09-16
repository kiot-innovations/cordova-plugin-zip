import { createAction } from 'redux-act'

export const SET_RMA_MODE = createAction('SET_RMA_MODE')
export const CLEAR_RMA = createAction('CLEAR_RMA')
export const RMA_SELECT_PVS = createAction('SELECT_PVS_RMA')
export const SET_NEW_EQUIPMENT = createAction('SET_NEW_EQUIPMENT')

export const FETCH_DEVICE_TREE = createAction('FETCH_DEVICE_TREE')
export const FETCH_DEVICE_TREE_SUCCESS = createAction(
  'FETCH_DEVICE_TREE_SUCCESS'
)
export const FETCH_DEVICE_TREE_ERROR = createAction('FETCH_DEVICE_TREE_ERROR')

export const UPDATE_DEVICE_TREE = createAction('UPDATE_DEVICE_TREE')
export const RESET_RMA_PVS = createAction('RESET_RMA_PVS')

export const RMA_REMOVE_DEVICES = createAction('RMA_REMOVE_DEVICES')
export const RMA_REMOVE_DEVICES_SUCCESS = createAction(
  'RMA_REMOVE_DEVICES_SUCCESS'
)
export const RMA_REMOVE_DEVICES_ERROR = createAction('RMA_REMOVE_DEVICES_ERROR')

export const RMA_REMOVE_STORAGE = createAction('RMA_REMOVE_STORAGE')
export const RMA_REMOVE_IN_PROGRESS = createAction('RMA_REMOVE_IN_PROGRESS')
export const RMA_REMOVE_STORAGE_SUCCESS = createAction(
  'RMA_REMOVE_STORAGE_SUCCESS'
)
export const RMA_REMOVE_STORAGE_ERROR = createAction('RMA_REMOVE_STORAGE_ERROR')
export const RMA_REMOVE_STORAGE_CANCEL = createAction(
  'RMA_REMOVE_STORAGE_CANCEL'
)
export const RMA_REMOVE_STORAGE_RESET_STORAGE_REMOVED = createAction(
  'RMA_REMOVE_STORAGE_RESET_STORAGE_REMOVED'
)
