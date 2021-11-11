import { createAction } from 'redux-act'

export const SYSTEM_CHECKS_INIT = createAction('SYSTEM_CHECKS_INIT')
export const SYSTEM_CHECKS_SUCCESS = createAction('SYSTEM_CHECKS_SUCCESS')
export const SYSTEM_CHECKS_ERROR = createAction('SYSTEM_CHECKS_ERROR')

export const GET_SYSTEM_CHECKS_INIT = createAction('GET_SYSTEM_CHECKS_INIT')
export const GET_SYSTEM_CHECKS_UPDATE = createAction('GET_SYSTEM_CHECKS_UPDATE')
export const GET_SYSTEM_CHECKS_SUCCESS = createAction(
  'GET_SYSTEM_CHECKS_SUCCESS'
)
export const GET_SYSTEM_CHECKS_ERROR = createAction('GET_SYSTEM_CHECKS_ERROR')

export const RESET_SYSTEM_CHECKS = createAction('RESET_SYSTEM_CHECKS')
