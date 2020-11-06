import { createReducer } from 'redux-act'

import {
  SUBMIT_CLEAR,
  REPLACE_RMA_PVS,
  SUBMIT_CONFIG,
  SUBMIT_CONFIG_SUCCESS,
  SUBMIT_CONFIG_ERROR,
  SUBMIT_COMMISSION_SUCCESS,
  SUBMIT_COMMISSION_ERROR,
  RESET_SYSTEM_CONFIGURATION,
  ALLOW_COMMISSIONING
} from 'state/actions/systemConfiguration'
import { RESET_COMMISSIONING } from 'state/actions/global'

const initialState = {
  submitting: false,
  config: {},
  error: '',
  commissioned: false,
  canCommission: false
}

export const submitConfigReducer = createReducer(
  {
    [REPLACE_RMA_PVS]: state => ({
      ...state,
      submitting: true
    }),
    [SUBMIT_CONFIG]: (state, payload) => ({
      ...state,
      submitting: true,
      config: payload
    }),
    [SUBMIT_CONFIG_SUCCESS]: state => ({
      ...state,
      submitting: true,
      error: initialState.error
    }),
    [SUBMIT_CONFIG_ERROR]: (state, payload) => ({
      ...state,
      submitting: false,
      error: payload
    }),
    [SUBMIT_COMMISSION_SUCCESS]: state => ({
      ...state,
      submitting: false,
      commissioned: true
    }),
    [SUBMIT_COMMISSION_ERROR]: (state, payload) => ({
      ...state,
      submitting: false,
      error: payload
    }),
    [ALLOW_COMMISSIONING]: state => ({
      ...state,
      canCommission: true
    }),
    [SUBMIT_CLEAR]: () => initialState,
    [RESET_SYSTEM_CONFIGURATION]: () => initialState,
    [RESET_COMMISSIONING]: () => initialState
  },
  initialState
)
