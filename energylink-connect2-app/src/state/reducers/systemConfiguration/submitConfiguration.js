import { createReducer } from 'redux-act'

import {
  SUBMIT_CLEAR,
  SUBMIT_CONFIG,
  SUBMIT_CONFIG_SUCCESS,
  SUBMIT_CONFIG_ERROR,
  SUBMIT_COMMISSION_SUCCESS,
  SUBMIT_COMMISSION_ERROR,
  RESET_SYSTEM_CONFIGURATION
} from 'state/actions/systemConfiguration'

const initialState = {
  submitting: false,
  submitted: false,
  config: {},
  error: '',
  commissioned: false
}

export const submitConfigReducer = createReducer(
  {
    [SUBMIT_CONFIG]: (state, payload) => ({
      ...state,
      submitting: true,
      config: payload
    }),
    [SUBMIT_CONFIG_SUCCESS]: state => ({
      ...state,
      submitted: true
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
    [SUBMIT_CLEAR]: () => initialState,
    [RESET_SYSTEM_CONFIGURATION]: () => initialState
  },
  initialState
)
