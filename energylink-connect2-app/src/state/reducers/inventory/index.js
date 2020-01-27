import { createReducer } from 'redux-act'
import {
  FETCH_INVENTORY_INIT,
  FETCH_INVENTORY_ERROR,
  FETCH_INVENTORY_SUCCESS,
  SAVE_INVENTORY_INIT,
  SAVE_INVENTORY_SUCCESS,
  SAVE_INVENTORY_ERROR,
  UPDATE_MI_COUNT
} from '../../actions/inventory'

const initialState = {
  bom: [
    { item: 'MODULES', value: '0' },
    { item: 'STRING_INVERTERS', value: '0' },
    { item: 'METERS', value: '0' },
    { item: 'MET_STATION', value: '0' },
    { item: 'ESS', value: 'None' },
    { item: 'GCM', value: '0' }
  ],
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
      bom: payload,
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
          if (item.item === 'MODULES') {
            item.value = payload
          }
          return item
        })
      ]
    })
  },
  initialState
)
