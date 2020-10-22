import { createReducer } from 'redux-act'
import { propOr } from 'ramda'
import {
  PVS_CONNECTION_INIT,
  PVS_CONNECTION_SUCCESS,
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
  EXECUTE_ENABLE_ACCESS_POINT_SUCCESS
} from '../../actions/network'

const initialState = {
  connected: false,
  connecting: false,
  connectionCanceled: false,
  showEnablingAccessPoint: false,
  err: '',
  SSID: '',
  password: '',
  bluetoothEnabled: false,
  bluetoothEnabledStarted: false,
  bluetoothStatus: '',
  wifiEnabled: false,
  wifiEnabledStarted: false
}

export const BLESTATUS = {
  DISCOVERING_PVS_BLE: 'DISCOVERING_PVS_BLE',
  CONNECTING_PVS_VIA_BLE: 'CONNECTING_PVS_VIA_BLE',
  ENABLING_ACCESS_POINT_ON_PVS: 'ENABLING_ACCESS_POINT_ON_PVS',
  ENABLED_ACCESS_POINT_ON_PVS: 'ENABLED_ACCESS_POINT_ON_PVS',
  FAILED_ACCESS_POINT_ON_PVS: 'FAILED_ACCESS_POINT_ON_PVS'
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
    [PVS_CONNECTION_SUCCESS]: state => ({
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
      showEnablingAccessPoint: false
    })
  },
  initialState
)
