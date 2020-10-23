import { createAction } from 'redux-act'

export const SET_LAST_VISITED_PAGE = createAction('SET_LAST_VISITED_PAGE')
export const RESET_LAST_VISITED_PAGE = createAction('RESET_LAST_VISITED_PAGE')
export const CHECK_APP_UPDATE_INIT = createAction('CHECK_APP_UPDATE_INIT')
export const CHECK_APP_UPDATE_SUCCESS = createAction('CHECK_APP_UPDATE_SUCCESS')
export const CHECK_APP_UPDATE_ERROR = createAction('CHECK_APP_UPDATE_ERROR')
export const APP_UPDATE_OPEN_MARKET = createAction('APP_UPDATE_OPEN_MARKET')
export const APP_UPDATE_OPEN_MARKET_SUCCESS = createAction(
  'APP_UPDATE_OPEN_MARKET_SUCCESS'
)
export const APP_UPDATE_OPEN_MARKET_ERROR = createAction(
  'APP_UPDATE_OPEN_MARKET_ERROR'
)
