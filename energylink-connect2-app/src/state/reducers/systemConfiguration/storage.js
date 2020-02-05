import { createReducer } from 'redux-act'
import {
  GET_STORAGE_INIT,
  GET_STORAGE_SUCCESS
} from 'state/actions/systemConfiguration'

const initialState = {
  isFetching: false,
  data: {}
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
    })
  },
  initialState
)

export default storageReducer
