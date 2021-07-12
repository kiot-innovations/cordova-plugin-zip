import { createAction } from 'redux-act'

import { validateSession } from './auth'

export const DEVICE_RESUME = createAction('DEVICE_RESUME')
export const DEVICE_READY = createAction('DEVICE_READY')

export const NABTO_PORT_OPEN = createAction('NABTO_PORT_OPEN')
export const NABTO_ASSOCIATED_SUCCESS = createAction('NABTO_ASSOCIATED_SUCCESS')
export const NABTO_ERROR = createAction('NABTO_ERROR')

export const deviceResumeListener = () => {
  return (dispatch, getState) => {
    const state = getState()

    if (!state.global.isDeviceResumeListened && !state.user.isAuthenticating) {
      document.addEventListener(
        'resume',
        () => {
          dispatch(DEVICE_RESUME())
          dispatch(validateSession())
        },
        false
      )
    }
  }
}
