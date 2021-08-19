import { createAction } from 'redux-act'

export const FETCH_INVENTORY_INIT = createAction('FETCH_INVENTORY_INIT')
export const FETCH_INVENTORY_ERROR = createAction('FETCH_INVENTORY_ERROR')
export const FETCH_INVENTORY_SUCCESS = createAction('FETCH_INVENTORY_SUCCESS')
export const SAVE_INVENTORY = createAction('SAVE_INVENTORY')
export const UPDATE_INVENTORY = createAction('UPDATE_INVENTORY')
export const UPDATE_MI_COUNT = createAction('UPDATE_MI_COUNT')
export const UPDATE_OTHER_INVENTORY = createAction('UPDATE_OTHER_INVENTORY')
export const RESET_INVENTORY = createAction('RESET_INVENTORY')
