import { createReducer } from 'redux-act'
import { clone } from 'ramda'
import {
  FETCH_INVENTORY_INIT,
  FETCH_INVENTORY_ERROR,
  FETCH_INVENTORY_SUCCESS,
  SAVE_INVENTORY_INIT,
  SAVE_INVENTORY_SUCCESS,
  SAVE_INVENTORY_ERROR,
  UPDATE_MI_COUNT,
  RESET_INVENTORY,
  SAVE_INVENTORY_RMA
} from '../../actions/inventory'

const initialState = {
  bom: [
    { item: 'AC_MODULES', value: '0' },
    { item: 'DC_MODULES', value: '0' },
    { item: 'STRING_INVERTERS', value: '0' },
    { item: 'EXTERNAL_METERS', value: '0' },
    { item: 'ESS', value: '0' }
  ],
  rma: {
    ess: '',
    mi_count: 0,
    other: false
  },
  fetchingInventory: false,
  savingInventory: false
}

export const inventoryReducer = createReducer(
  {
    [FETCH_INVENTORY_INIT]: state => ({
      ...state,
      fetchingInventory: true
    }),
    [FETCH_INVENTORY_SUCCESS]: (state, payload) => ({
      ...state,
      bom: payload,
      fetchingInventory: false
    }),
    [FETCH_INVENTORY_ERROR]: (state, payload) => ({
      ...state,
      bom: {},
      fetchingInventory: false,
      err: payload
    }),
    [SAVE_INVENTORY_INIT]: state => ({
      ...state,
      savingInventory: true
    }),
    [SAVE_INVENTORY_SUCCESS]: (state, payload) => ({
      ...state,
      bom: clone(payload),
      savingInventory: false
    }),
    [SAVE_INVENTORY_ERROR]: (state, payload) => ({
      ...state,
      savingInventory: false,
      err: payload
    }),
    [UPDATE_MI_COUNT]: (state, payload) => ({
      ...state,
      bom: [
        ...state.bom.map(item => {
          if (item.item === 'AC_MODULES') {
            item.value = payload
          }
          return item
        })
      ]
    }),
    [RESET_INVENTORY]: () => ({
      ...initialState,
      bom: clone(initialState.bom)
    }),
    [SAVE_INVENTORY_RMA]: (state, payload) => ({
      ...state,
      rma: {
        ...state.rma,
        [payload.name]: payload.value
      }
    })
  },
  initialState
)
