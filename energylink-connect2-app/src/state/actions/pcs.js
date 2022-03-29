import { createAction } from 'redux-act'

export const SET_BUSBAR_RATING = createAction('SET_BUSBAR_RATING')
export const SET_BREAKER_RATING = createAction('SET_BREAKER_RATING')
export const SET_HUB_PLUS_BREAKER_RATING = createAction(
  'SET_HUB_PLUS_BREAKER_RATING'
)
export const SET_ENABLE_PCS = createAction('SET_ENABLE_PCS')
export const SET_PCS_APPLIED = createAction('SET_PCS_APPLIED')

export const FETCH_PCS_SETTINGS_INIT = createAction('FETCH_PCS_SETTINGS_INIT')
export const FETCH_PCS_SETTINGS_SUCCESS = createAction(
  'FETCH_PCS_SETTINGS_SUCCESS'
)
export const FETCH_PCS_SETTINGS_ERROR = createAction('FETCH_PCS_SETTINGS_ERROR')

export const SUBMIT_PCS_SETTINGS_INIT = createAction('SUBMIT_PCS_SETTINGS_INIT')
export const SUBMIT_PCS_SETTINGS_SUCCESS = createAction(
  'SUBMIT_PCS_SETTINGS_SUCCESS'
)
export const SUBMIT_PCS_SETTINGS_ERROR = createAction(
  'SUBMIT_PCS_SETTINGS_ERROR'
)
