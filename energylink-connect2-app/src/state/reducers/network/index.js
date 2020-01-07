import { createReducer } from 'redux-act'
import {
  PVS_CONNECTION_INIT,
  PVS_CONNECTION_SUCCESS,
  PVS_CONNECTION_ERROR,
  PVS_CLEAR_ERROR
} from '../../actions/network'

const initialState = {
  connected: false,
  connecting: false,
  err: '',
  SSID: '',
  password: ''
}

export const networkReducer = createReducer(
  {
    [PVS_CONNECTION_INIT]: state => ({
      ...state,
      connecting: true
    }),
    [PVS_CONNECTION_SUCCESS]: (state, ssid, password) => ({
      ...state,
      SSID: ssid,
      password: password,
      connected: true,
      connecting: false
    }),
    [PVS_CONNECTION_ERROR]: (state, payload) => ({
      ...state,
      err: payload,
      connected: false,
      connecting: false
    }),
    [PVS_CLEAR_ERROR]: state => ({
      initialState
    })
  },
  initialState
)
