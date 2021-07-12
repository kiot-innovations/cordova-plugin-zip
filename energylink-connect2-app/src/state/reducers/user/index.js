import { createReducer } from 'redux-act'

import {
  LOGIN_SUCCESS,
  LOGIN_INIT,
  LOGOUT,
  LOGIN_ERROR,
  REFRESH_TOKEN_SUCCESS,
  VALIDATE_SESSION_INIT,
  VALIDATE_SESSION_SUCCESS,
  VALIDATE_SESSION_ERROR
} from 'state/actions/auth'
import {
  SET_DEALER_NAME,
  GET_USER_INIT,
  GET_USER_SUCCESS
} from 'state/actions/user'

const initialState = {
  auth: {},
  data: {}
}

export const userReducer = createReducer(
  {
    [LOGIN_INIT]: (state, payload) => ({
      ...state,
      isAuthenticating: true,
      auth: { ...state.auth, state: payload.state }
    }),
    [LOGIN_SUCCESS]: (state, payload) => ({
      ...state,
      auth: { ...state.auth, ...payload.auth },
      data: { ...payload.data },
      isAuthenticating: false
    }),
    [LOGIN_ERROR]: (state, payload) => ({
      ...state,
      initialState,
      err: { ...payload },
      isAuthenticating: false
    }),
    [GET_USER_INIT]: state => ({ ...state, data: {} }),
    [GET_USER_SUCCESS]: (state, payload) => ({
      ...state,
      data: payload
    }),
    [LOGOUT]: () => initialState,
    [REFRESH_TOKEN_SUCCESS]: (state, payload) => ({
      ...state,
      auth: payload // payload comes with all
    }),
    [SET_DEALER_NAME]: (state, dealerName) => ({
      ...state,
      data: { ...state.data, dealerName }
    }),
    [VALIDATE_SESSION_INIT]: state => ({
      ...state,
      auth: { ...state.auth },
      isAuthenticating: true
    }),
    [VALIDATE_SESSION_SUCCESS]: state => ({
      ...state,
      auth: { ...state.auth },
      isAuthenticating: false
    }),
    [VALIDATE_SESSION_ERROR]: state => ({
      ...state,
      auth: { ...state.auth },
      isAuthenticating: false
    })
  },
  initialState
)
