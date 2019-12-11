import { createReducer } from 'redux-act'
import {
  LOGIN_ERROR,
  LOGIN_INIT,
  LOGIN_SUCCESS,
  LOGOUT,
  VALIDATE_SESSION_ERROR,
  VALIDATE_SESSION_INIT,
  VALIDATE_SESSION_SUCCESS
} from '../../actions/auth'

import {
  GET_USER_INIT,
  GET_USER_SUCCESS,
  UPDATE_USER_ERROR,
  UPDATE_USER_INIT,
  UPDATE_USER_SUCCESS
} from '../../actions/user'

const initialState = {
  auth: {
    userId: '123'
  },
  data: {
    userId: 137954,
    addressId: 84471,
    addresses: [84471],
    accountId: null,
    username: 'fwtestbanks@test.com',
    tokenID: '47c925c5-660b-457f-ac00-e6d67b8a0d15',
    expiresEpm: 1576004257375
  },
  isUpdatingUser: false
}

export const userReducer = createReducer(
  {
    [LOGIN_INIT]: state => ({
      ...state,
      auth: {},
      isAuthenticating: true
    }),
    [LOGIN_SUCCESS]: (state, payload) => ({
      ...state,
      auth: { ...payload },
      isAuthenticating: false
    }),
    [LOGIN_ERROR]: (state, payload) => ({
      ...state,
      err: { ...payload },
      isAuthenticating: false
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
