import { unionWith, eqBy, prop } from 'ramda'
import { createReducer } from 'redux-act'

import { PUSH_CANDIDATES_ERROR } from 'state/actions/devices'
import { FIRMWARE_GET_VERSION_COMPLETE } from 'state/actions/firmwareUpdate'
import { RESET_COMMISSIONING } from 'state/actions/global'
import {
  CONNECT_PVS_VIA_BLE,
  EXECUTE_ENABLE_ACCESS_POINT
} from 'state/actions/network'
import {
  ADD_PVS_SN,
  SAVE_PVS_SN,
  UPDATE_SN,
  GET_SN_INIT,
  GET_SN_SUCCESS,
  GET_SN_ERROR,
  REMOVE_SN,
  START_DISCOVERY_INIT,
  START_COMMISSIONING_ERROR,
  START_COMMISSIONING_SUCCESS,
  START_DISCOVERY_ERROR,
  START_DISCOVERY_SUCCESS,
  SET_METADATA_INIT,
  SET_METADATA_SUCCESS,
  SET_METADATA_ERROR,
  RESET_METADATA_STATUS,
  RESET_PVS_INFO_STATE,
  MI_DATA_SUCCESS,
  MI_DATA_ERROR,
  SET_WPS_SUPPORT,
  SET_PVS_MODEL
} from 'state/actions/pvs'

const initialState = {
  model: '',
  serialNumber: '',
  serialNumbers: [],
  serialNumbersError: [],
  fetchingSN: false,
  takenImage: null,
  startCommissioningStatus: null,
  startDiscoveryStatus: null,
  settingMetadata: false,
  setMetadataStatus: null,
  miData: [],
  miDataError: null,
  lastDiscoveryType: '',
  bleDevice: null,
  bleConnectionInfo: null,
  wpsSupport: false,
  fwVersion: 0
}

export const pvsReducer = createReducer(
  {
    [SET_PVS_MODEL]: (state, model) => ({ ...state, model }),
    [START_DISCOVERY_INIT]: (state, payload) => ({
      ...state,
      lastDiscoveryType: payload.type
    }),
    [PUSH_CANDIDATES_ERROR]: (state, { candidates }) => ({
      ...state,
      serialNumbersError: candidates
    }),
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
    [SET_WPS_SUPPORT]: (state, payload) => ({
      ...state,
      wpsSupport: payload
    }),
    [UPDATE_SN]: (state, payload) => ({
      ...state,
      serialNumbers: payload
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
    [RESET_METADATA_STATUS]: state => ({
      ...state,
      settingMetadata: initialState.settingMetadata,
      setMetadataStatus: initialState.setMetadataStatus
    }),
    [RESET_PVS_INFO_STATE]: () => initialState,
    [RESET_COMMISSIONING]: () => initialState,
    [MI_DATA_SUCCESS]: (state, miData) => ({
      ...state,
      miData,
      miDataError: null
    }),
    [MI_DATA_ERROR]: (state, miDataError) => ({
      ...state,
      miDataError,
      miData: null
    }),
    [CONNECT_PVS_VIA_BLE]: (state, bleDevice) => ({
      ...state,
      bleDevice,
      serialNumber: prop('name', bleDevice)
    }),
    [EXECUTE_ENABLE_ACCESS_POINT]: (state, bleConnectionInfo) => ({
      ...state,
      bleConnectionInfo
    }),
    [FIRMWARE_GET_VERSION_COMPLETE]: (state, payload) => ({
      ...state,
      fwVersion: payload
    })
  },
  initialState
)
