import { createAction } from 'redux-act'

import { namedAction } from 'shared/redux-utils'

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

export const GET_SITE_INIT = createAction('GET_SITE_INIT')
export const GET_SITE_SUCCESS = createAction('GET_SITE_SUCCESS')
export const GET_SITE_ERROR = createAction('GET_SITE_ERROR')

export const ON_GET_SITE_INFO = createAction('ON_GET_SITE_INFO')
export const ON_GET_SITE_INFO_END = createAction('ON_GET_SITE_INFO_END')

//ANALYTICS
const siteAnalyticsActions = namedAction('SITE ANALYTICS')
export const NO_SITE_FOUND = siteAnalyticsActions('NO_SITE_FOUND')
export const HOME_SCREEN_CREATE_SITE = siteAnalyticsActions('CREATE_SITE')

const homeOwner = namedAction('HOME OWNER CREATE ACCOUNT')
export const CREATE_HOMEOWNER_ACCOUNT = homeOwner('Initialize')
export const CREATE_HOMEOWNER_ACCOUNT_RESET = homeOwner('Reset')
export const ACTIVATE_HOMEOWNER_ACCOUNT = homeOwner('Activate')
export const CREATE_HOMEOWNER_ACCOUNT_COMPLETE = homeOwner('Completed')
export const CREATE_HOMEOWNER_ACCOUNT_ERROR = homeOwner('Error')
