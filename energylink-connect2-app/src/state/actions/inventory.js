import { createAction } from 'redux-act'

export const FETCH_INVENTORY_INIT = createAction('FETCH_INVENTORY_INIT')
export const FETCH_INVENTORY_ERROR = createAction('FETCH_INVENTORY_ERROR')
export const FETCH_INVENTORY_SUCCESS = createAction('FETCH_INVENTORY_SUCCESS')
export const SAVE_INVENTORY_INIT = createAction('SAVE_INVENTORY_INIT')
export const SAVE_INVENTORY_ERROR = createAction('SAVE_INVENTORY_ERROR')
export const SAVE_INVENTORY_SUCCESS = createAction('SAVE_INVENTORY_SUCCESS')
export const UPDATE_MI_COUNT = createAction('UPDATE_MI_COUNT')
export const RESET_INVENTORY = createAction('RESET_INVENTORY')

const mockedInventory = [
  { item: 'AC_MODULES', value: '0' },
  { item: 'DC_MODULES', value: '0' },
  { item: 'STRING_INVERTERS', value: '0' },
  { item: 'EXTERNAL_METERS', value: '0' },
  { item: 'ESS', value: '0' }
]

export const fetchInventory = () => {
  return async dispatch => {
    try {
      dispatch(FETCH_INVENTORY_INIT())
      dispatch(FETCH_INVENTORY_SUCCESS(mockedInventory))
    } catch (err) {
      dispatch(FETCH_INVENTORY_ERROR(err))
    }
  }
}

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
