import { prop } from 'ramda'
import { createReducer } from 'redux-act'

import { RESET_COMMISSIONING } from 'state/actions/global'
import {
  SUBMIT_CLEAR,
  REPLACE_RMA_PVS,
  SUBMIT_CONFIG,
  SUBMIT_CONFIG_SUCCESS,
  SUBMIT_CONFIG_ERROR,
  SUBMIT_COMMISSION_SUCCESS,
  SUBMIT_COMMISSION_ERROR,
  RESET_SYSTEM_CONFIGURATION,
  ALLOW_COMMISSIONING,
  SUBMIT_PRECONFIG_GRIDPROFILE,
  SUBMIT_PRECONFIG_ERROR,
  SUBMIT_PRECONFIG_SUCCESS,
  SUBMIT_COMMISSION_INIT
} from 'state/actions/systemConfiguration'

export const preconfigStates = {
  NOT_STARTED: 'NOT_STARTED',
  STARTED: 'STARTED',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR'
}

export const initialState = {
  submitting: false,
  submitted: false,
  config: {},
  error: '',
  commissioned: false,
  canCommission: false,
  preconfigState: preconfigStates.NOT_STARTED,
  preconfigError: ''
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
      submitted: false,
      config: payload
    }),
    [SUBMIT_CONFIG_SUCCESS]: state => ({
      ...state,
      submitting: false,
      submitted: true,
      error: initialState.error
    }),
    [SUBMIT_CONFIG_ERROR]: (state, payload) => ({
      ...state,
      submitting: false,
      submitted: false,
      error: payload
    }),
    [SUBMIT_COMMISSION_INIT]: state => ({
      ...state,
      submitting: true,
      error: initialState.error,
      commissioned: false
    }),
    [SUBMIT_COMMISSION_SUCCESS]: state => ({
      ...state,
      submitting: false,
      commissioned: true
    }),
    [SUBMIT_COMMISSION_ERROR]: (state, payload) => ({
      ...state,
      submitting: false,
      commissioned: false,
      error: prop('message', payload)
    }),
    [ALLOW_COMMISSIONING]: state => ({
      ...state,
      canCommission: true
    }),
    [SUBMIT_PRECONFIG_GRIDPROFILE]: state => ({
      ...state,
      preconfigState: preconfigStates.STARTED
    }),
    [SUBMIT_PRECONFIG_SUCCESS]: state => ({
      ...state,
      preconfigState: preconfigStates.SUCCESS,
      preconfigError: initialState.preconfigError
    }),
    [SUBMIT_PRECONFIG_ERROR]: (state, payload) => ({
      ...state,
      preconfigState: preconfigStates.ERROR,
      preconfigError: payload
    }),
    [SUBMIT_CLEAR]: () => initialState,
    [RESET_SYSTEM_CONFIGURATION]: () => initialState,
    [RESET_COMMISSIONING]: () => initialState
  },
  initialState
)
