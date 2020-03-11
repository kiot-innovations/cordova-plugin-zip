import { createReducer } from 'redux-act'
import { isEmpty } from 'ramda'

import {
  GET_NETWORK_APS_INIT,
  GET_NETWORK_APS_SUCCESS,
  GET_NETWORK_APS_ERROR,
  CONNECT_NETWORK_AP_INIT,
  CONNECT_NETWORK_AP_ERROR,
  GET_INTERFACES_SUCCESS
} from 'state/actions/systemConfiguration'

import { getConnectedAP } from 'shared/utils'

const initialState = {
  aps: [],
  selectedAP: { label: '', value: '', ap: null },
  isFetching: false,
  isConnected: false,
  error: null
}

export const networkReducer = createReducer(
  {
    [GET_NETWORK_APS_INIT]: state => ({
      ...state, // preserve previously connected state
      isFetching: true,
      error: null
    }),

    [GET_NETWORK_APS_SUCCESS]: (state, aps) => ({
      ...state,
      aps,
      error: null,
      isFetching: false
    }),

    [GET_NETWORK_APS_ERROR]: (state, error) => ({
      ...state,
      error,
      isFetching: false
    }),

    [CONNECT_NETWORK_AP_INIT]: state => ({
      ...state,
      isFetching: true,
      isConnected: false,
      error: null
    }),
    [GET_INTERFACES_SUCCESS]: (state, interfaces) => {
      const selectedAP = getConnectedAP(interfaces, state.aps)
      return {
        ...state,
        isConnected: !isEmpty(selectedAP.label),
        isFetching: false,
        selectedAP
      }
    },

    [CONNECT_NETWORK_AP_ERROR]: (state, error) => ({
      ...state,
      isFetching: false,
      isConnected: false,
      error
    })
  },
  initialState
)
