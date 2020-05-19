import { createAction } from 'redux-act'

export const GET_SITES_INIT = createAction('GET_SITES_INIT')
export const GET_SITES_SUCCESS = createAction('GET_SITES_SUCCESS')
export const GET_SITES_ERROR = createAction('GET_SITES_ERROR')
export const SET_SITE = createAction('SET_SITE')
export const SET_MAP_VIEW_SRC = createAction('SET_MAP_VIEW_LOADED')
export const RESET_SITE = createAction('RESET_SITE')
export const CREATE_SITE_INIT = createAction('CREATE_SITE_INIT')
export const CREATE_SITE_SUCCESS = createAction('CREATE_SITE_SUCCESS')
export const CREATE_SITE_ERROR = createAction('CREATE_SITE_ERROR')
export const CREATE_SITE_RESET = createAction('CREATE_SITE_RESET')
