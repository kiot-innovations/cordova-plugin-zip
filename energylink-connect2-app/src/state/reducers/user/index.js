import { createReducer } from 'redux-act'
import {
  LOGIN_SUCCESS,
  LOGIN_INIT,
  LOGOUT,
  LOGIN_ERROR,
  SET_TOKEN,
  VALIDATE_SESSION_INIT,
  VALIDATE_SESSION_SUCCESS,
  VALIDATE_SESSION_ERROR
} from '../../actions/auth'

import {
  GET_USER_INIT,
  GET_USER_SUCCESS,
  UPDATE_USER_INIT,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR
} from '../../actions/user'

const initialState = {
  auth: {},
  data: {},
  isUpdatingUser: false
}

export const userReducer = createReducer(
  {
    [LOGIN_INIT]: (state, payload) => ({
      ...state,
      isAuthenticating: true,
      auth: { ...state.auth, state: payload.state, nonce: payload.nonce }
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
      err: { ...payload }
    }),
    [SET_TOKEN]: (state, payload) => ({
      ...state,
      auth: { ...state.auth, id_token: payload }
    }),

    [GET_USER_INIT]: state => ({ ...state, data: {} }),
    [GET_USER_SUCCESS]: (state, payload) => ({
      ...state,
      data: payload
    }),
    [UPDATE_USER_INIT]: state => ({ ...state, isUpdatingUser: true }),
    [UPDATE_USER_SUCCESS]: state => ({
      ...state,
      isUpdatingUser: false
    }),
    [UPDATE_USER_ERROR]: state => ({ ...state, isUpdatingUser: false }),
    [LOGOUT]: () => initialState,
    [VALIDATE_SESSION_INIT]: state => ({
      ...state,
      auth: { ...state.auth, isAuthenticating: true }
    }),
    [VALIDATE_SESSION_SUCCESS]: state => ({
      ...state,
      auth: { ...state.auth, isAuthenticating: false }
    }),
    [VALIDATE_SESSION_ERROR]: state => ({
      ...state,
      auth: { ...state.auth, isAuthenticating: false }
    })
  },
  initialState
)
