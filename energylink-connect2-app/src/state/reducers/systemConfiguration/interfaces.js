import { createReducer } from 'redux-act'
import {
  GET_INTERFACES_INIT,
  GET_INTERFACES_SUCCESS,
  GET_INTERFACES_ERROR,
  RESET_SYSTEM_CONFIGURATION
} from 'state/actions/systemConfiguration'

const initialState = {
  isFetching: false,
  data: [],
  error: null
}

const interfacesReducer = createReducer(
  {
    [GET_INTERFACES_INIT]: () => ({
      ...initialState,
      isFetching: true
    }),
    [GET_INTERFACES_SUCCESS]: (state, payload) => ({
      ...state,
      isFetching: false,
      data: payload
    }),
    [GET_INTERFACES_ERROR]: (state, payload) => ({
      ...state,
      isFetching: false,
      error: payload
    }),
    [RESET_SYSTEM_CONFIGURATION]: () => initialState
  },
  initialState
)

export default interfacesReducer
