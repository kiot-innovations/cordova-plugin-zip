import { createReducer } from 'redux-act'
import {
  SET_RMA_MODE,
  CLEAR_RMA,
  SET_NEW_EQUIPMENT,
  FETCH_DEVICE_TREE,
  FETCH_DEVICE_TREE_SUCCESS,
  FETCH_DEVICE_TREE_ERROR,
  UPDATE_DEVICE_TREE,
  RMA_SELECT_PVS,
  RESET_RMA_PVS,
  RMA_REMOVE_DEVICES,
  RMA_REMOVE_DEVICES_SUCCESS,
  RMA_REMOVE_DEVICES_ERROR
} from 'state/actions/rma'
import { RESET_COMMISSIONING } from 'state/actions/global'

export const rmaModes = {
  NONE: 'NONE',
  REPLACE_PVS: 'REPLACE_PVS',
  EDIT_DEVICES: 'EDIT_DEVICES'
}

const initialState = {
  rmaMode: rmaModes.NONE,
  newEquipment: false,
  cloudDeviceTree: {
    fetching: false,
    error: '',
    devices: []
  },
  pvs: null,
  deletingMIs: false,
  deletingMIsError: false
}

const RMAReducer = createReducer(
  {
    [RMA_SELECT_PVS]: (state, pvs) => ({
      ...state,
      pvs
    }),
    [CLEAR_RMA]: () => ({
      ...initialState
    }),
    [SET_NEW_EQUIPMENT]: (state, payload) => ({
      ...state,
      newEquipment: payload
    }),
    [SET_RMA_MODE]: (state, mode) => ({
      ...state,
      rmaMode: mode
    }),
    [FETCH_DEVICE_TREE]: state => ({
      ...state,
      cloudDeviceTree: {
        ...state.cloudDeviceTree,
        error: initialState.cloudDeviceTree.error,
        fetching: true
      }
    }),
    [FETCH_DEVICE_TREE_SUCCESS]: (state, payload) => ({
      ...state,
      cloudDeviceTree: {
        fetching: false,
        error: initialState.cloudDeviceTree.error,
        devices: payload
      }
    }),
    [FETCH_DEVICE_TREE_ERROR]: (state, payload) => ({
      ...state,
      cloudDeviceTree: {
        fetching: false,
        error: payload,
        devices: initialState.cloudDeviceTree.devices
      }
    }),
    [UPDATE_DEVICE_TREE]: (state, payload) => ({
      ...state,
      cloudDeviceTree: {
        ...state.cloudDeviceTree,
        devices: payload
      }
    }),
    [RESET_RMA_PVS]: () => ({ ...initialState }),
    [RMA_REMOVE_DEVICES]: state => ({
      ...state,
      deletingMIs: true,
      deletingMIsError: false
    }),
    [RMA_REMOVE_DEVICES_SUCCESS]: state => ({
      ...state,
      deletingMIs: false,
      deletingMIsError: false
    }),
    [RMA_REMOVE_DEVICES_ERROR]: state => ({
      ...state,
      deletingMIs: false,
      deletingMIsError: true
    }),
    [RESET_COMMISSIONING]: () => initialState
  },
  initialState
)

export default RMAReducer
