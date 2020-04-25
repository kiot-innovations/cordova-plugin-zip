import { createReducer } from 'redux-act'
import { propOr } from 'ramda'
import {
  PVS_CONNECTION_INIT,
  PVS_CONNECTION_SUCCESS,
  PVS_CONNECTION_ERROR,
  PVS_CLEAR_ERROR,
  RESET_PVS_CONNECTION,
  STOP_NETWORK_POLLING
} from '../../actions/network'

const initialState = {
  connected: false,
  connecting: false,
  connectionCanceled: false,
  err: '',
  SSID: '',
  password: ''
}

export const networkReducer = createReducer(
  {
    [PVS_CONNECTION_INIT]: (state, { ssid, password }) => ({
      ...state,
      SSID: ssid,
      password: password,
      connecting: true,
      err: ''
    }),
    [PVS_CONNECTION_SUCCESS]: state => ({
      ...state,
      connected: true,
      connecting: false,
      connectionCanceled: false,
      err: ''
    }),
    [PVS_CONNECTION_ERROR]: (state, payload) => ({
      ...state,
      err: payload,
      connected: false,
      connecting: false
    }),
    [PVS_CLEAR_ERROR]: state => ({
      ...state,
      err: '',
      connected: false,
      connecting: false
    }),
    [STOP_NETWORK_POLLING]: (state, payload) => ({
      ...state,
      connecting: false,
      connected: false,
      connectionCanceled: propOr(false, 'canceled', payload)
    }),
    [RESET_PVS_CONNECTION]: () => initialState
  },
  initialState
)
