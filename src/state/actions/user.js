import { createAction } from 'redux-act'
import { httpGet, httpPatch } from '../../shared/fetch'
import { logout } from './auth'

export const GET_USER_INIT = createAction('GET_USER_INIT')
export const GET_USER_SUCCESS = createAction('GET_USER_SUCCESS')
export const GET_USER_ERROR = createAction('GET_USER_ERROR')

export const getUser = () => {
  return async (dispatch, getState) => {
    try {
      dispatch(GET_USER_INIT())
      const state = getState()
      const { status, data } = await httpGet(
        `/user/${state.user.auth.userId}`,
        state
      )
      return status === 200
        ? dispatch(GET_USER_SUCCESS(data))
        : dispatch(GET_USER_ERROR(data))
    } catch (err) {
      dispatch(GET_USER_ERROR(err))
    }
  }
}

export const UPDATE_USER_INIT = createAction('UPDATE_USER_INIT')
export const UPDATE_USER_SUCCESS = createAction('UPDATE_USER_SUCCESS')
export const UPDATE_USER_ERROR = createAction('UPDATE_USER_ERROR')

export const updateUser = (values, userId = null, signout = false) => {
  return async (dispatch, getState) => {
    try {
      dispatch(UPDATE_USER_INIT())
      const state = getState()
      userId = userId || state.user.auth.userId
      const { status, data } = await httpPatch(`/user/${userId}`, values, state)
      if (status !== 200) {
        dispatch(UPDATE_USER_ERROR(data))
        return
      }
      dispatch(UPDATE_USER_SUCCESS())
      return signout ? dispatch(logout()) : dispatch(getUser())
    } catch (err) {
      dispatch(UPDATE_USER_ERROR(err))
    }
  }
}

export const SELECT_ENERGY_GRAPH = createAction('SELECT_ENERGY_GRAPH')

export const GRAPHS = {
  ENERGY: 'energy',
  POWER: 'power'
}
