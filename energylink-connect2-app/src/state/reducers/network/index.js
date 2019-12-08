import { createReducer } from 'redux-act'
import {
  PVS_CONNECTION_INIT,
  PVS_CONNECTION_SUCCESS,
  PVS_CONNECTION_ERROR
} from '../../actions/network'

const initialState = {
  connected: false,
  connecting: false,
  err: ''
}

export const networkReducer = createReducer(
  {
    [PVS_CONNECTION_INIT]: state => ({
      ...state,
      connecting: true
    }),
    [PVS_CONNECTION_SUCCESS]: state => ({
      ...state,
      connected: true
    }),
    [PVS_CONNECTION_ERROR]: (state, payload) => ({
      ...state,
      err: payload
    })
  },
  initialState
)
