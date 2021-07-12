import { createReducer } from 'redux-act'

import { RESET_COMMISSIONING } from 'state/actions/global'
import {
  GET_STORAGE_INIT,
  GET_STORAGE_SUCCESS,
  GET_STORAGE_ERROR,
  RESET_SYSTEM_CONFIGURATION
} from 'state/actions/systemConfiguration'

const initialState = {
  isFetching: false,
  data: {},
  error: null
}

const storageReducer = createReducer(
  {
    [GET_STORAGE_INIT]: () => ({
      ...initialState,
      isFetching: true
    }),
    [GET_STORAGE_SUCCESS]: (state, payload) => ({
      ...state,
      isFetching: false,
      data: payload
    }),
    [GET_STORAGE_ERROR]: (state, payload) => ({
      ...state,
      isFetching: false,
      error: payload
    }),
    [RESET_SYSTEM_CONFIGURATION]: () => initialState,
    [RESET_COMMISSIONING]: () => initialState
  },
  initialState
)

export default storageReducer
