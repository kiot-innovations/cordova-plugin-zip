import { createReducer } from 'redux-act'
import {
  GET_RSE_INIT,
  GET_RSE_SUCCESS,
  GET_RSE_ERROR
} from 'state/actions/systemConfiguration'

const initialState = {
  isFetching: false,
  data: {},
  error: null
}

const rseReducer = createReducer(
  {
    [GET_RSE_INIT]: () => ({
      ...initialState,
      isFetching: true
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
    })
  },
  initialState
)

export default rseReducer
