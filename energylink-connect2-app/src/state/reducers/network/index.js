import { propOr, uniqWith } from 'ramda'
import { createReducer } from 'redux-act'

import { eqByProp } from 'shared/utils'
import { RESET_COMMISSIONING } from 'state/actions/global'
import {
  PVS_CONNECTION_INIT,
  PVS_CONNECTION_INIT_AFTER_REBOOT,
  PVS_CONNECTION_SUCCESS,
  PVS_CONNECTION_SUCCESS_AFTER_REBOOT,
  PVS_CONNECTION_ERROR,
  PVS_CLEAR_ERROR,
  RESET_PVS_CONNECTION,
  STOP_NETWORK_POLLING,
  ENABLE_ACCESS_POINT,
  HIDE_ENABLING_ACCESS_POINT,
  ENABLE_BLUETOOTH_SUCCESS,
  CHECK_BLUETOOTH_STATUS_SUCCESS,
  CHECK_WIFI_STATUS_INIT,
  CHECK_WIFI_STATUS_SUCCESS,
  CHECK_BLUETOOTH_STATUS_INIT,
  RESET_WIFI_STATUS,
  RESET_BLUETOOTH_STATUS,
  CONNECT_PVS_VIA_BLE,
  EXECUTE_ENABLE_ACCESS_POINT,
  FAILURE_BLUETOOTH_ACTION,
  EXECUTE_ENABLE_ACCESS_POINT_SUCCESS,
  SET_ONLINE,
  CHECK_PERMISSIONS_INIT,
  CHECK_PERMISSIONS_SUCCESS,
  CHECK_PERMISSIONS_ERROR,
  BLE_UPDATE_DEVICES,
  BLE_GET_DEVICES,
  BLE_GET_DEVICES_ERROR,
  SET_AP_PWD,
  SET_SSID,
  SET_CONNECTION_STATUS,
  BLE_GET_DEVICES_ENDED,
  SET_INTERNET_CONNECTION
} from 'state/actions/network'

export const appConnectionStatus = {
  NOT_CONNECTED: 'Not connected',
  NOT_USING_WIFI: 'Not using Wifi',
  NOT_CONNECTED_PVS: 'Not connected to PVS AP',
  CONNECTED: 'Connected'
}

const initialState = {
  connected: false,
  connecting: false,
  connectionCanceled: false,
  showEnablingAccessPoint: false,
  showManualInstructions: false,
  isOnline: false,
  err: '',
  SSID: '',
  password: '',
  bluetoothEnabled: false,
  bluetoothEnabledStarted: false,
  bluetoothStatus: '',
  wifiEnabled: false,
  wifiEnabledStarted: false,
  bluetoothAuthorized: false,
  checkingPermission: false,
  checkingPermissionError: null,
  bleSearching: false,
  bleError: '',
  nearbyDevices: [],
  connectionStatus: appConnectionStatus.NOT_CONNECTED,
  hasInternetConnection: true
}

export const BLESTATUS = {
  DISCOVERING_PVS_BLE: 'DISCOVERING_PVS_BLE',
  CONNECTING_PVS_VIA_BLE: 'CONNECTING_PVS_VIA_BLE',
  ENABLING_ACCESS_POINT_ON_PVS: 'ENABLING_ACCESS_POINT_ON_PVS',
  ENABLED_ACCESS_POINT_ON_PVS: 'ENABLED_ACCESS_POINT_ON_PVS',
  FAILED_ACCESS_POINT_ON_PVS: 'FAILED_ACCESS_POINT_ON_PVS',
  DISCOVERY_FAILURE: 'DISCOVERY_FAILURE',
  DISCOVERY_SUCCESS: 'DISCOVERY_SUCCESS'
}

export const networkReducer = createReducer(
  {
    [PVS_CONNECTION_INIT]: (state, { ssid, password }) => {
      const newState = {
        ...state,
        SSID: ssid,
        password: password,
        connecting: true,
        connected: false,
        showEnablingAccessPoint: false,
        err: ''
      }

      if (
        state.SSID === ssid &&
        state.password === password &&
        state.connecting &&
        !state.connected
      )
        return state

      return newState
    },
    [PVS_CONNECTION_INIT_AFTER_REBOOT]: (state, { ssid, password }) => {
      const newState = {
        ...state,
        SSID: ssid,
        password: password,
        connecting: true,
        connected: false,
        showEnablingAccessPoint: false,
        err: ''
      }

      if (
        state.SSID === ssid &&
        state.password === password &&
        state.connecting &&
        !state.connected
      )
        return state

      return newState
    },
    [PVS_CONNECTION_SUCCESS]: state => ({
      ...state,
      connected: true,
      connecting: false,
      connectionCanceled: false,
      showEnablingAccessPoint: false,
      err: ''
    }),
    [PVS_CONNECTION_SUCCESS_AFTER_REBOOT]: state => ({
      ...state,
      connected: true,
      connecting: false,
      connectionCanceled: false,
      showEnablingAccessPoint: false,
      err: ''
    }),
    [PVS_CONNECTION_ERROR]: (state, payload) => ({
      ...state,
      err: payload,
      connected: false,
      connecting: false
    }),
    [PVS_CLEAR_ERROR]: state => ({
      ...state,
      err: '',
      connected: false,
      connecting: false
    }),
    [STOP_NETWORK_POLLING]: (state, payload) => ({
      ...state,
      connecting: false,
      connected: false,
      connectionCanceled: propOr(false, 'canceled', payload)
    }),
    [RESET_PVS_CONNECTION]: () => initialState,
    [RESET_COMMISSIONING]: () => initialState,
    [CONNECT_PVS_VIA_BLE]: state => ({
      ...state,
      bluetoothStatus: BLESTATUS.CONNECTING_PVS_VIA_BLE
    }),
    [EXECUTE_ENABLE_ACCESS_POINT]: state => ({
      ...state,
      bluetoothStatus: BLESTATUS.ENABLING_ACCESS_POINT_ON_PVS
    }),
    [EXECUTE_ENABLE_ACCESS_POINT_SUCCESS]: state => ({
      ...state,
      bluetoothStatus: BLESTATUS.ENABLED_ACCESS_POINT_ON_PVS
    }),
    [ENABLE_ACCESS_POINT]: state => ({
      ...state,
      showEnablingAccessPoint: true,
      bluetoothStatus: BLESTATUS.DISCOVERING_PVS_BLE
    }),
    [HIDE_ENABLING_ACCESS_POINT]: state => ({
      ...state,
      showEnablingAccessPoint: false
    }),
    [ENABLE_BLUETOOTH_SUCCESS]: state => ({
      ...state,
      bluetoothEnabled: true,
      bluetoothEnabledStarted: false
    }),
    [CHECK_BLUETOOTH_STATUS_INIT]: state => ({
      ...state,
      bluetoothEnabled: false,
      bluetoothEnabledStarted: true
    }),
    [CHECK_BLUETOOTH_STATUS_SUCCESS]: state => ({
      ...state,
      bluetoothEnabled: true,
      bluetoothEnabledStarted: false
    }),
    [CHECK_WIFI_STATUS_INIT]: state => ({
      ...state,
      wifiEnabled: false,
      wifiEnabledStarted: true
    }),
    [CHECK_WIFI_STATUS_SUCCESS]: state => ({
      ...state,
      wifiEnabled: true,
      wifiEnabledStarted: false
    }),
    [RESET_WIFI_STATUS]: state => ({
      ...state,
      wifiEnabled: false,
      wifiEnabledStarted: false
    }),
    [RESET_BLUETOOTH_STATUS]: state => ({
      ...state,
      wifiEnabled: false,
      wifiEnabledStarted: false
    }),
    [FAILURE_BLUETOOTH_ACTION]: state => ({
      ...state,
      bluetoothStatus: BLESTATUS.FAILED_ACCESS_POINT_ON_PVS,
      showEnablingAccessPoint: false,
      showManualInstructions: false
    }),
    [SET_ONLINE]: (state, isOnline) => ({
      ...state,
      isOnline
    }),
    [CHECK_PERMISSIONS_INIT]: state => ({
      ...state,
      checkingPermission: true,
      checkingPermissionError: null
    }),
    [CHECK_PERMISSIONS_SUCCESS]: (state, bluetoothAuthorized) => ({
      ...state,
      checkingPermission: false,
      checkingPermissionError: null,
      bluetoothAuthorized
    }),
    [CHECK_PERMISSIONS_ERROR]: (state, checkingPermissionError) => ({
      ...state,
      checkingPermission: false,
      checkingPermissionError
    }),
    [BLE_GET_DEVICES]: state => ({
      ...state,
      bleSearching: true
    }),
    [BLE_UPDATE_DEVICES]: (state, device) => {
      return {
        ...state,
        bleSearching: false,
        bluetoothStatus: BLESTATUS.DISCOVERY_SUCCESS,
        nearbyDevices: uniqWith(eqByProp('name'), [
          ...state.nearbyDevices,
          device
        ])
      }
    },
    [BLE_GET_DEVICES_ENDED]: state => ({
      ...state,
      bleSearching: false
    }),
    [BLE_GET_DEVICES_ERROR]: state => {
      const nextstate = {
        ...state,
        bleSearching: false
      }

      if (state.bluetoothStatus !== BLESTATUS.DISCOVERY_SUCCESS) {
        nextstate.bluetoothStatus = BLESTATUS.DISCOVERY_FAILURE
        return nextstate
      }

      return { ...state, bleSearching: false }
    },
    [SET_SSID]: (state, payload) => ({
      ...state,
      SSID: payload
    }),
    [SET_AP_PWD]: (state, payload) => ({
      ...state,
      password: payload
    }),
    [SET_CONNECTION_STATUS]: (state, payload) => ({
      ...state,
      connectionStatus: payload
    }),
    [SET_INTERNET_CONNECTION]: (state, payload) => ({
      ...state,
      hasInternetConnection: payload
    })
  },
  initialState
)
