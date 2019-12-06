import { createReducer } from 'redux-act'
import {
  PVS_CONNECTION_INIT,
  PVS_CONNECTION_SUCCESS,
  PVS_CONNECTION_ERROR
} from '../../actions/network'

const initialState = {
  currentSSID: '',
  connecting: false
}

export const networkReducer = createReducer(
  {
    [PVS_CONNECTION_INIT]: state => ({
      ...state,
      connecting: true
    }),
    [PVS_CONNECTION_SUCCESS]: (state, payload) => ({
      ...state,
      currentSSID: payload
    }),
    [PVS_CONNECTION_ERROR]: (state, payload) => ({
      ...state,
      err: payload
    })
  },
  initialState
)
