import { createReducer } from 'redux-act'

import {
  GET_NETWORK_APS_INIT,
  GET_NETWORK_APS_SUCCESS,
  GET_NETWORK_APS_ERROR,
  CONNECT_NETWORK_AP_INIT,
  CONNECT_NETWORK_AP_SUCCESS,
  CONNECT_NETWORK_AP_ERROR
} from 'state/actions/systemConfiguration'

const initialState = {
  aps: [],
  selectedAP: null,
  isFetching: false,
  isConnected: false,
  error: null
}

export const networkReducer = createReducer(
  {
    [GET_NETWORK_APS_INIT]: (state, payload) => ({
      ...state,
      isFetching: true
    }),

    [GET_NETWORK_APS_SUCCESS]: (state, aps) => ({
      ...state,
      aps,
      isFetching: false
    }),

    [GET_NETWORK_APS_ERROR]: (state, error) => ({
      ...initialState,
      error
    }),

    [CONNECT_NETWORK_AP_INIT]: state => ({
      ...state,
      isFetching: true,
      isConnected: false
    }),

    [CONNECT_NETWORK_AP_SUCCESS]: (state, ap) => ({
      ...state,
      isFetching: false,
      isConnected: true,
      selectedAP: ap
    }),

    [CONNECT_NETWORK_AP_ERROR]: (state, error) => ({
      ...state,
      isFetching: false,
      isConnected: false,
      error
    })
  },
  initialState
)
