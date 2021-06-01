import { createReducer } from 'redux-act'
import { getElapsedTime, gotDisconnection, gotReconnection } from 'shared/utils'
import {
  BEGIN_INSTALL,
  COMMISSION_SUCCESS,
  CONFIG_START,
  CLAIM_DEVICES_MIXPANEL_EVENT,
  RESET_PVS_INTERNET_TRACKING,
  SET_AC_DEVICES,
  START_BULK_SETTINGS_TIMER
} from 'state/actions/analytics'

import {
  CLAIM_DEVICES_ERROR,
  CLAIM_DEVICES_COMPLETE,
  CLAIM_DEVICES_INIT,
  PUSH_CANDIDATES_INIT
} from 'state/actions/devices'

import { SET_CONNECTION_STATUS } from 'state/actions/network'
import {
  CONNECT_NETWORK_AP_INIT,
  CONNECT_NETWORK_AP_ERROR,
  SUBMIT_COMMISSION_SUCCESS,
  SUBMIT_CONFIG
} from 'state/actions/systemConfiguration'

export const initialState = {
  commissioningTimer: 0,
  configureTimer: 0,
  pvsInternetSsid: '',
  pvsInternetMode: '',
  pvsInternetTimer: 0,
  selectingACModelTimer: 0,
  submitTimer: 0,
  bulkSettingsTimer: 0,
  timeFromMiScan: 0,
  claimingDevices: {
    status: 'idle',
    claimingTime: 0
  },
  commissioningSuccess: false,
  siteUnderCommissioning: '',
  disconnectionTimer: 0,
  reconnectionTime: 0,
  reconnectionTimes: 0,
  connectionStatus: null
}

const siteUnderCommissioningChanged = (siteKey, siteUnderCommissioning) => {
  if (!siteKey && !siteUnderCommissioning) {
    return false
  }

  return siteKey !== siteUnderCommissioning
}

export default createReducer(
  {
    [CLAIM_DEVICES_ERROR]: state => ({
      ...state,
      claimDeviceErrorTimer: new Date().getTime()
    }),
    [CONFIG_START]: state => ({
      ...state,
      configureTimer: new Date().getTime()
    }),

    [CLAIM_DEVICES_INIT]: state => {
      if (state.claimingDevices.status === 'idle')
        return {
          ...state,
          claimingDevices: {
            ...state.claimingDevices,
            status: 'claiming',
            claimingTime: Date.now()
          }
        }
      return state
    },
    [CLAIM_DEVICES_COMPLETE]: state => {
      if (state.claimingDevices.status === 'claiming')
        return {
          ...state,
          claimingDevices: {
            ...state.claimingDevices,
            status: 'waiting device update',
            claimingTime: getElapsedTime(state.claimingDevices.claimingTime)
          }
        }
      return state
    },
    [CLAIM_DEVICES_MIXPANEL_EVENT]: state => {
      if (state.claimingDevices.status === 'waiting device update')
        return {
          ...state,
          claimingDevices: initialState.claimingDevices
        }
      return state
    },
    [PUSH_CANDIDATES_INIT]: state => ({
      ...state,
      timeFromMiScan: new Date().getTime()
    }),
    [START_BULK_SETTINGS_TIMER]: state => ({
      ...state,
      bulkSettingsTimer: new Date().getTime()
    }),
    [SUBMIT_CONFIG]: state => ({
      ...state,
      submitTimer: new Date().getTime()
    }),
    [BEGIN_INSTALL]: (state, { siteKey }) => {
      const siteChanged = siteUnderCommissioningChanged(
        siteKey,
        state.siteUnderCommissioning
      )

      return {
        ...state,
        siteUnderCommissioning: siteKey,
        commissioningTimer: siteChanged
          ? new Date().getTime()
          : state.commissioningTimer,
        commissioningSuccess: siteChanged ? false : state.commissioningSuccess
      }
    },
    [SET_AC_DEVICES]: state => ({
      ...state,
      selectingACModelTimer: new Date().getTime()
    }),
    [COMMISSION_SUCCESS]: state => ({
      ...state,
      commissioningSuccess: true
    }),
    [CONNECT_NETWORK_AP_INIT]: (state, { mode, ssid }) => ({
      ...state,
      pvsInternetSsid: ssid,
      pvsInternetMode: mode,
      pvsInternetTimer: Date.now()
    }),
    [RESET_PVS_INTERNET_TRACKING]: state => ({
      ...state,
      pvsInternetSsid: '',
      pvsInternetMode: '',
      pvsInternetTimer: 0
    }),
    [CONNECT_NETWORK_AP_ERROR]: state => ({
      ...state,
      pvsInternetSsid: '',
      pvsInternetMode: '',
      pvsInternetTimer: 0
    }),
    [SET_CONNECTION_STATUS]: (state, payload) => ({
      ...state,
      connectionStatus: payload,
      disconnectionTimer: gotDisconnection(state.connectionStatus, payload)
        ? new Date().getTime()
        : 0,

      reconnectionTime: gotReconnection(state.connectionStatus, payload)
        ? getElapsedTime(state.disconnectionTimer)
        : 0,

      reconnectionTimes: gotReconnection(state.connectionStatus, payload)
        ? state.reconnectionTimes + 1
        : state.reconnectionTimes
    }),
    [SUBMIT_COMMISSION_SUCCESS]: state => ({
      ...state,
      reconnectionTimes: 0,
      reconnectionTime: 0,
      disconnectionTimer: 0
    })
  },
  initialState
)
