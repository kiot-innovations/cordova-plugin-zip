import { createAction } from 'redux-act'

export const DISCOVER_INIT = createAction('discover devices init')
export const DISCOVER_UPDATE = createAction('discover devices update')
export const DISCOVER_COMPLETE = createAction('discover devices complete')
export const DISCOVER_ERROR = createAction('discover devices error')
export const PUSH_CANDIDATES_INIT = createAction('PUSH_CANDIDATES_INIT')
export const PUSH_CANDIDATES_SUCCESS = createAction('PUSH_CANDIDATES_SUCCESS')
export const PUSH_CANDIDATES_ERROR = createAction('PUSH_CANDIDATES_ERROR')
export const FETCH_CANDIDATES_INIT = createAction('FETCH_CANDIDATES_INIT')
export const FETCH_CANDIDATES_UPDATE = createAction('FETCH_CANDIDATES_UPDATE')
export const FETCH_CANDIDATES_ERROR = createAction('FETCH_CANDIDATES_ERROR')
export const FETCH_CANDIDATES_COMPLETE = createAction(
  'FETCH_CANDIDATES_COMPLETE'
)
export const CLAIM_DEVICES_INIT = createAction('CLAIM_DEVICES_INIT')
export const CLAIM_DEVICES_SUCCESS = createAction('CLAIM_DEVICES_SUCCESS')
export const CLAIM_DEVICES_ERROR = createAction('CLAIM_DEVICES_ERROR')
export const RESET_DISCOVERY = createAction('RESET_DISCOVERY')
