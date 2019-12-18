import { createAction } from 'redux-act'
import { httpGet } from '../../shared/fetch'

export const GET_USER_INIT = createAction('GET_USER_INIT')
export const GET_USER_SUCCESS = createAction('GET_USER_SUCCESS')
export const GET_USER_ERROR = createAction('GET_USER_ERROR')

/* DEPRECATED */
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

export const SELECT_ENERGY_GRAPH = createAction('SELECT_ENERGY_GRAPH')

export const GRAPHS = {
  ENERGY: 'energy',
  POWER: 'power'
}
