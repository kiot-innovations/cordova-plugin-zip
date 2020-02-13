import { createReducer } from 'redux-act'

import {
  SUBMIT_CONFIG,
  SUBMIT_CONFIG_SUCCESS,
  SUBMIT_CONFIG_ERROR
} from 'state/actions/systemConfiguration'

const initialState = {
  submitting: false,
  submitted: false,
  config: {},
  err: ''
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
      submitting: false,
      submitted: true
    }),
    [SUBMIT_CONFIG_ERROR]: (state, payload) => ({
      ...state,
      submitting: false,
      err: payload
    })
  },
  initialState
)
