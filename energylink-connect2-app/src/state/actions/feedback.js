import { createAction } from 'redux-act'

export const SEND_FEEDBACK_INIT = createAction('SEND_FEEDBACK_INIT')
export const SEND_FEEDBACK_SUCCESS = createAction('SEND_FEEDBACK_SUCCESS')
export const SEND_FEEDBACK_ERROR = createAction('SEND_FEEDBACK_ERROR')

export const RESET_FEEDBACK_FORM = createAction('RESET_FEEDBACK_FORM')
