import { createReducer } from 'redux-act'
import {
  GET_RSE_INIT,
  GET_RSE_SUCCESS,
  GET_RSE_ERROR,
  SET_RSE_INIT,
  SET_RSE_SUCCESS,
  SET_RSE_STATUS
} from 'state/actions/systemConfiguration'

const initialState = {
  isFetching: false,
  isSetting: false,
  newRSEValue: null,
  data: {},
  error: null
}

const rseReducer = createReducer(
  {
    [GET_RSE_INIT]: (state, isPolling) => ({
      ...(isPolling ? state : initialState),
      isFetching: !isPolling
    }),
    [GET_RSE_SUCCESS]: (state, payload) => ({
      ...state,
      isFetching: false,
      data: payload
    }),
    [GET_RSE_ERROR]: (state, payload) => ({
      ...state,
      isFetching: false,
      error: payload
    }),
    [SET_RSE_INIT]: (state, payload) => ({
      ...state,
      isSetting: true,
      newRSEValue: payload
    }),
    [SET_RSE_STATUS]: state => ({
      ...state,
      data: {
        ...state.data,
        progress: 0
      }
    }),
    [SET_RSE_SUCCESS]: state => ({
      ...state,
      isSetting: false,
      isFetching: false
    })
  },
  initialState
)

export default rseReducer
