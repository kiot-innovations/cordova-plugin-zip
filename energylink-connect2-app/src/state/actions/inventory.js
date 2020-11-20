import { createAction } from 'redux-act'

export const FETCH_INVENTORY_INIT = createAction('FETCH_INVENTORY_INIT')
export const FETCH_INVENTORY_ERROR = createAction('FETCH_INVENTORY_ERROR')
export const FETCH_INVENTORY_SUCCESS = createAction('FETCH_INVENTORY_SUCCESS')
export const SAVE_INVENTORY_INIT = createAction('SAVE_INVENTORY_INIT')
export const SAVE_INVENTORY_ERROR = createAction('SAVE_INVENTORY_ERROR')
export const SAVE_INVENTORY_SUCCESS = createAction('SAVE_INVENTORY_SUCCESS')
export const UPDATE_INVENTORY = createAction('UPDATE_INVENTORY')
export const UPDATE_MI_COUNT = createAction('UPDATE_MI_COUNT')
export const UPDATE_STORAGE_INVENTORY = createAction('UPDATE_STORAGE_INVENTORY')
export const UPDATE_OTHER_INVENTORY = createAction('UPDATE_OTHER_INVENTORY')
export const RESET_INVENTORY = createAction('RESET_INVENTORY')

export const saveInventory = inventory => {
  return async dispatch => {
    try {
      dispatch(SAVE_INVENTORY_INIT())
      dispatch(SAVE_INVENTORY_SUCCESS(inventory))
    } catch (err) {
      dispatch(SAVE_INVENTORY_ERROR(err))
    }
  }
}
