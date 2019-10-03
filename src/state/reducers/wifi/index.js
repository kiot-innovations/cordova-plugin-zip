import { createReducer } from 'redux-act'
import {
  WIFI_COLLECTOR_INIT,
  WIFI_COLLECTOR_SUCCESS,
  WIFI_COLLECTOR_ERROR,
  WIFI_STATUS_INIT,
  WIFI_STATUS_SUCCESS,
  WIFI_NETWORKS_INIT,
  WIFI_NETWORKS_SUCCESS,
  WIFI_SET_INIT,
  WIFI_SET_SUCCESS,
  WIFI_COMMAND_STATUS_INIT,
  WIFI_COMMAND_STATUS_SUCCESS,
  WIFI_COMMAND_STATUS_ERROR,
  WIFI_STATUS_ERROR,
  WIFI_NETWORKS_ERROR,
  WIFI_SET_ERROR
} from '../../actions/wifi'

import { LOGOUT } from '../../actions/auth'

const initialState = {
  collector: {},
  collectorStatus: {},
  networks: [],
  isGettingCollector: false,
  isGettingCollectorStatus: false,
  isGettingNetworks: false,
  isSettingNetwork: false,
  isGettingCommand: false,
  hasScanError: false,
  hasWifiInitialData: false
}

function calculateSignalQuality(ssidbm) {
  if (ssidbm === 0) {
    return 0
  } else {
    if (ssidbm >= -67) {
      return 5
    } else if (ssidbm >= -72) {
      return 4
    } else if (ssidbm >= -77) {
      return 3
    } else if (ssidbm >= -82) {
      return 2
    } else if (ssidbm >= -87) {
      return 1
    } else {
      return 0
    }
  }
}

export const wifiReducer = createReducer(
  {
    [WIFI_COLLECTOR_INIT]: state => ({
      ...state,
      collector: {},
      isGettingCollector: true
    }),
    [WIFI_COLLECTOR_SUCCESS]: (state, payload) => ({
      ...state,
      collector: payload,
      isGettingCollector: false,
      hasWifiInitialData: true
    }),
    [WIFI_COLLECTOR_ERROR]: state => ({
      ...state,
      collector: {},
      isGettingCollector: false
    }),
    [WIFI_STATUS_INIT]: state => ({
      ...state,
      collectorStatus: {},
      isGettingCollectorStatus: true
    }),
    [WIFI_STATUS_SUCCESS]: (state, payload) => ({
      ...state,
      collectorStatus: payload,
      isGettingCollectorStatus: false
    }),
    [WIFI_STATUS_ERROR]: state => ({
      ...state,
      collectorStatus: {},
      isGettingCollectorStatus: false
    }),
    [WIFI_NETWORKS_INIT]: state => ({
      ...state,
      networks: [],
      isGettingNetworks: true,
      hasScanError: false
    }),
    [WIFI_NETWORKS_SUCCESS]: (state, payload) => ({
      ...state,
      networks: payload.map(n => ({
        ...n,
        signalQuality: calculateSignalQuality(n.rssiDbm)
      })),
      isGettingNetworks: false,
      hasScanError: false
    }),
    [WIFI_NETWORKS_ERROR]: state => ({
      ...state,
      networks: [],
      isGettingNetworks: false,
      hasScanError: true
    }),
    [WIFI_SET_INIT]: state => ({
      ...state,
      isSettingNetwork: true
    }),
    [WIFI_SET_SUCCESS]: (state, payload) => ({
      ...state,
      isSettingNetwork: false
    }),
    [WIFI_SET_ERROR]: state => ({
      ...state,
      isSettingNetwork: false
    }),
    [WIFI_COMMAND_STATUS_INIT]: state => ({
      ...state,
      isGettingCommand: true
    }),
    [WIFI_COMMAND_STATUS_SUCCESS]: (state, payload) => ({
      ...state,
      commands: payload,
      isGettingCommand: false
    }),
    [WIFI_COMMAND_STATUS_ERROR]: (state, payload) => ({
      ...state,
      isGettingCommand: false
    }),
    [LOGOUT]: () => initialState
  },
  initialState
)
