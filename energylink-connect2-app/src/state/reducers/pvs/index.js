import { createReducer } from 'redux-act'
import { unionWith, eqBy, prop } from 'ramda'

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
  SET_METADATA_INIT,
  SET_METADATA_SUCCESS,
  SET_METADATA_ERROR,
  RESET_PVS_INFO_STATE,
  MI_DATA_SUCCESS,
  MI_DATA_ERROR
} from '../../actions/pvs'

const initialState = {
  serialNumber: '',
  serialNumbers: [],
  fetchingSN: false,
  takenImage: null,
  startCommissioningStatus: null,
  startDiscoveryStatus: null,
  settingMetadata: false,
  setMetadataStatus: null,
  miData: null,
  miDataError: null
}

export const pvsReducer = createReducer(
  {
    [ADD_PVS_SN]: (state, sn) => ({
      ...state,
      serialNumbers: unionWith(
        eqBy(prop('serial_number')),
        state.serialNumbers,
        [sn]
      )
    }),
    [SAVE_PVS_SN]: (state, payload) => ({
      ...state,
      serialNumber: payload
    }),
    [SET_METADATA_INIT]: state => ({
      ...state,
      settingMetadata: true
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
      settingMetadata: false,
      setMetadataStatus: payload
    }),
    [SET_METADATA_ERROR]: (state, payload) => ({
      ...state,
      settingMetadata: false,
      setMetadataStatus: payload
    }),
    [RESET_PVS_INFO_STATE]: () => initialState,
    [MI_DATA_SUCCESS]: (state, miData) => ({
      ...state,
      miData,
      miDataError: null
    }),
    [MI_DATA_ERROR]: (state, miDataError) => ({
      ...state,
      miDataError,
      miData: null
    })
  },
  initialState
)
