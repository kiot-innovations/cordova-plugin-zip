import { createReducer } from 'redux-act'
import { clone } from 'ramda'
import {
  FETCH_INVENTORY_INIT,
  FETCH_INVENTORY_ERROR,
  FETCH_INVENTORY_SUCCESS,
  SAVE_INVENTORY_INIT,
  SAVE_INVENTORY_SUCCESS,
  SAVE_INVENTORY_ERROR,
  UPDATE_OTHER_INVENTORY,
  RESET_INVENTORY,
  UPDATE_INVENTORY
} from 'state/actions/inventory'
import { RESET_COMMISSIONING } from 'state/actions/global'

const initialState = {
  bom: [
    { item: 'AC_MODULES', value: '0', disabled: false },
    { item: 'DC_MODULES', value: '0', disabled: true },
    { item: 'STRING_INVERTERS', value: '0', disabled: true },
    { item: 'EXTERNAL_METERS', value: '0', disabled: true },
    { item: 'ESS', value: '0', disabled: false }
  ],
  rma: {
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
    [RESET_INVENTORY]: () => ({
      ...initialState,
      bom: clone(initialState.bom)
    }),
    [RESET_COMMISSIONING]: () => initialState,
    [UPDATE_INVENTORY]: (state, payload) => ({
      ...state,
      bom: [
        ...state.bom.map(item => {
          if (item.item === payload.name) {
            item.value = payload.value
          }
          return item
        })
      ]
    }),
    [UPDATE_OTHER_INVENTORY]: (state, payload) => ({
      ...state,
      rma: {
        ...state.rma,
        other: payload
      }
    })
  },
  initialState
)
