import { createReducer } from 'redux-act'
import { union } from 'ramda'

import {
  ADD_PVS_SN,
  SAVE_PVS_SN,
  GET_SN_INIT,
  GET_SN_SUCCESS,
  GET_SN_ERROR,
  REMOVE_SN,
  START_COMMISSIONING_ERROR,
  START_COMMISSIONING_SUCCESS,
  START_DISCOVERY_ERROR,
  START_DISCOVERY_SUCCESS,
  SET_METADATA_SUCCESS,
  SET_METADATA_ERROR,
  UPDATE_MI_MODELS
} from '../../actions/pvs'

const initialState = {
  serialNumber: '',
  serialNumbers: [],
  fetchingSN: false,
  takenImage: null,
  startCommissioningStatus: null,
  startDiscoveryStatus: null,
  startSetMetaDataStatus: null
}

export const pvsReducer = createReducer(
  {
    [ADD_PVS_SN]: (state, sn) => ({
      ...state,
      serialNumbers: union(state.serialNumbers, [sn])
    }),
    [SAVE_PVS_SN]: (state, payload) => ({
      ...state,
      serialNumber: payload
    }),
    [GET_SN_INIT]: state => ({
      ...state,
      fetchingSN: true
    }),
    [GET_SN_SUCCESS]: (state, data) => ({
      ...state,
      fetchingSN: false,
      serialNumbers: data
    }),
    [GET_SN_ERROR]: (state, data) => ({
      ...state,
      fetchingSN: false,
      error: data
    }),
    [REMOVE_SN]: (state, sn) => ({
      ...state,
      serialNumbers: state.serialNumbers.filter(
        device => device.serial_number !== sn
      )
    }),
    [START_COMMISSIONING_SUCCESS]: (state, payload) => ({
      ...state,
      startCommissioningStatus: payload
    }),
    [START_COMMISSIONING_ERROR]: (state, payload) => ({
      ...state,
      startCommissioningStatus: payload
    }),
    [START_DISCOVERY_SUCCESS]: (state, payload) => ({
      ...state,
      startDiscoveryStatus: payload
    }),
    [START_DISCOVERY_ERROR]: (state, payload) => ({
      ...state,
      startDiscoveryStatus: payload
    }),
    [SET_METADATA_SUCCESS]: (state, payload) => ({
      ...state,
      startSetMetaDataStatus: payload
    }),
    [SET_METADATA_ERROR]: (state, payload) => ({
      ...state,
      startSetMetaDataStatus: payload
    }),
    [UPDATE_MI_MODELS]: (state, payload) => ({
      ...state,
      serialNumbers: payload
    })
  },
  initialState
)
