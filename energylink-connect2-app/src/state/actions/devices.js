import { createAction } from 'redux-act'

export const DISCOVER_INIT = createAction('discover devices init')
export const DISCOVER_UPDATE = createAction('discover devices update')
export const DISCOVER_COMPLETE = createAction('discover devices complete')
export const DISCOVER_ERROR = createAction('discover devices error')
