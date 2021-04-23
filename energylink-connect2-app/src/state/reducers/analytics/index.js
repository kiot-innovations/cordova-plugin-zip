import { createReducer } from 'redux-act'
import { getElapsedTime, gotDisconnection, gotReconnection } from 'shared/utils'
import {
  BEGIN_INSTALL,
  COMMISSION_SUCCESS,
  CONFIG_START,
  START_BULK_SETTINGS_TIMER,
  SET_AC_DEVICES
} from 'state/actions/analytics'
import { SET_CONNECTION_STATUS } from 'state/actions/network'
import {
  SUBMIT_COMMISSION_SUCCESS,
  SUBMIT_CONFIG
} from 'state/actions/systemConfiguration'
import { CLAIM_DEVICES_INIT } from 'state/actions/devices'
import { CONNECT_NETWORK_AP_INIT } from 'state/actions/systemConfiguration'

export const initialState = {
  commissioningTimer: 0,
  configureTimer: 0,
  pvsInternetTimer: 0,
  selectingACModelTimer: 0,
  submitTimer: 0,
  bulkSettingsTimer: 0,
  timeFromMiScan: 0,
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
    [CONFIG_START]: state => ({
      ...state,
      configureTimer: new Date().getTime()
    }),
    [CLAIM_DEVICES_INIT]: state => ({
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
    [CONNECT_NETWORK_AP_INIT]: state => ({
      ...state,
      pvsInternetTimer: new Date().getTime()
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
