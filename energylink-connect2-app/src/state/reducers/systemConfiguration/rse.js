import { createReducer } from 'redux-act'
import { propOr } from 'ramda'
import {
  GET_RSE_INIT,
  GET_RSE_SUCCESS,
  GET_RSE_ERROR,
  SET_RSE_INIT,
  SET_RSE_SUCCESS,
  SET_RSE_STATUS,
  SET_RSE_ERROR
} from 'state/actions/systemConfiguration'

const initialState = {
  isSetting: false,
  isPolling: false,
  newRSEValue: null,
  data: {},
  error: null
}

const rseReducer = createReducer(
  {
    [GET_RSE_INIT]: (state, isPolling = false) => ({
      ...(isPolling ? state : initialState),
      isPolling,
      data: {
        ...state.data,
        progress: null
      }
    }),
    [GET_RSE_SUCCESS]: (state, payload) => ({
      ...state,
      isSetting: state.isPolling && propOr(0, 'progress', payload) < 100,
      data: payload
    }),
    [GET_RSE_ERROR]: (state, payload) => ({
      ...state,
      error: payload
    }),
    [SET_RSE_INIT]: (state, payload) => ({
      ...state,
      isSetting: true,
      newRSEValue: payload
    }),
    [SET_RSE_STATUS]: state => ({
      ...state,
      isPolling: true
    }),
    [SET_RSE_SUCCESS]: state => ({
      ...state,
      isSetting: false,
      isPolling: false
    }),
    [SET_RSE_ERROR]: (state, error) => ({
      ...initialState,
      error
    })
  },
  initialState
)

export default rseReducer
