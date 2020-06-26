import { createReducer } from 'redux-act'
import {
  GET_ESS_STATUS_SUCCESS,
  GET_ESS_STATUS_ERROR,
  GET_ESS_STATUS_INIT
} from 'state/actions/storage'

const initialState = {
  status: {
    results: null,
    error: null
  }
}

export const storageReducer = createReducer(
  {
    [GET_ESS_STATUS_INIT]: state => ({
      ...state,
      status: { results: null, error: null }
    }),
    [GET_ESS_STATUS_SUCCESS]: (state, results) => ({
      ...state,
      status: { results, error: null }
    }),
    [GET_ESS_STATUS_ERROR]: (state, error) => ({
      ...state,
      status: { error }
    })
  },
  initialState
)
