import { createReducer } from 'redux-act'
import { isEmpty, prop } from 'ramda'

import {
  GET_NETWORK_APS_INIT,
  GET_NETWORK_APS_SUCCESS,
  GET_NETWORK_APS_ERROR,
  CONNECT_NETWORK_AP_INIT,
  CONNECT_NETWORK_AP_ERROR,
  GET_INTERFACES_SUCCESS,
  SET_SELECTED_AP,
  RESET_SYSTEM_CONFIGURATION
} from 'state/actions/systemConfiguration'
import { RESET_COMMISSIONING } from 'state/actions/global'

import { getConnectedAP } from 'shared/utils'

const initialState = {
  aps: [],
  selectedAP: { ssid: '' },
  connectedToAP: { label: '', value: '', ap: null },
  isFetching: false,
  isConnecting: false,
  isConnected: false,
  errorFetching: null,
  errorConnecting: null
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

    [CONNECT_NETWORK_AP_INIT]: state => ({
      ...state,
      isFetching: false,
      isConnected: false,
      isConnecting: true,
      errorFetching: null,
      errorConnecting: null
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

    [SET_SELECTED_AP]: (state, selectedAP) => ({
      ...state,
      selectedAP
    }),
    [RESET_SYSTEM_CONFIGURATION]: () => initialState,
    [RESET_COMMISSIONING]: () => initialState
  },
  initialState
)
