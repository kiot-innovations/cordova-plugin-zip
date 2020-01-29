import { createAction } from 'redux-act'

export const FETCH_GRID_BEHAVIOR = createAction('FETCH_GRID_BEHAVIOR')
export const FETCH_GRID_BEHAVIOR_ERR = createAction('FETCH_GRID_BEHAVIOR_ERR')
export const FETCH_GRID_BEHAVIOR_SUCCESS = createAction(
  'FETCH_GRID_BEHAVIOR_SUCCESS'
)
export const SET_GRID_PROFILE = createAction('SET_GRID_PROFILE')
export const SET_EXPORT_LIMIT = createAction('SET_EXPORT_LIMIT')
export const SET_GRID_VOLTAGE = createAction('SET_GRID_VOLTAGE')
