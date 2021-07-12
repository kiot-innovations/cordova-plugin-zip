import { isEmpty, prop } from 'ramda'
import { createReducer } from 'redux-act'

import { getConnectedAP } from 'shared/utils'
import { RESET_COMMISSIONING } from 'state/actions/global'
import {
  GET_NETWORK_APS_INIT,
  GET_NETWORK_APS_SUCCESS,
  GET_NETWORK_APS_ERROR,
  CONNECT_NETWORK_AP_INIT,
  CONNECT_NETWORK_AP_ERROR,
  GET_INTERFACES_SUCCESS,
  SET_SELECTED_AP,
  RESET_SYSTEM_CONFIGURATION,
  SET_WPS_CONNECTION_STATUS
} from 'state/actions/systemConfiguration'

const initialState = {
  aps: [],
  selectedAP: { ssid: '' },
  connectedToAP: { label: '', value: '', ap: null },
  isFetching: false,
  isConnecting: false,
  isConnected: false,
  errorFetching: null,
  errorConnecting: null,
  wpsConnectionStatus: 'idle' // 'idle' || 'connecting' || 'success' || 'error'
}

export const networkReducer = createReducer(
  {
    [GET_NETWORK_APS_INIT]: state => ({
      ...state, // preserve previously connected state
      isFetching: true,
      isConnecting: false,
      errorFetching: null,
      errorConnecting: null
    }),

    [GET_NETWORK_APS_SUCCESS]: (state, aps) => ({
      ...state,
      aps,
      errorFetching: null,
      errorConnecting: null,
      isFetching: false,
      isConnecting: false
    }),

    [GET_NETWORK_APS_ERROR]: (state, error) => ({
      ...state,
      errorFetching: error,
      errorConnecting: null,
      isFetching: false,
      isConnecting: false,
      isConnected: false
    }),

    [CONNECT_NETWORK_AP_INIT]: (state, { mode }) => ({
      ...state,
      isFetching: false,
      isConnected: false,
      isConnecting: true,
      errorFetching: null,
      errorConnecting: null,
      wpsConnectionStatus:
        mode === 'wps-pbc' ? 'connecting' : state.wpsConnectionStatus
    }),
    [GET_INTERFACES_SUCCESS]: (state, interfaces) => {
      const connectedToAP = getConnectedAP(interfaces, state.aps)
      const selectedAP = { ssid: connectedToAP.value }
      const error =
        state.isFetching &&
        state.selectedAP.ssid !== '' &&
        state.selectedAP.ssid !== prop('ssid', connectedToAP.ap)

      return {
        ...state,
        errorConnecting: error,
        errorFetching: null,
        isConnected: !error && !isEmpty(connectedToAP.label),
        isConnecting: false,
        connectedToAP,
        selectedAP
      }
    },

    [CONNECT_NETWORK_AP_ERROR]: (state, error) => ({
      ...state,
      isFetching: false,
      isConnecting: false,
      isConnected: false,
      errorConnecting: error,
      errorFetching: null
    }),

    [SET_WPS_CONNECTION_STATUS]: (state, payload) => ({
      ...state,
      wpsConnectionStatus: payload
    }),

    [SET_SELECTED_AP]: (state, selectedAP) => ({
      ...state,
      selectedAP
    }),
    [RESET_SYSTEM_CONFIGURATION]: () => initialState,
    [RESET_COMMISSIONING]: () => initialState
  },
  initialState
)
