import { createReducer } from 'redux-act'

import {
  GET_NETWORK_APS_INIT,
  GET_NETWORK_APS_SUCCESS,
  GET_NETWORK_APS_ERROR,
  SET_NETWORK_AP
} from 'state/actions/systemConfiguration'

const initialState = {
  aps: [],
  selectedAP: null,
  isFetching: false,
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

    [SET_NETWORK_AP]: (state, AP) => ({
      ...state,
      selectedAP: AP
    })
  },
  initialState
)
