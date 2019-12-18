import { createAction } from 'redux-act'
import { validateSession } from './auth'

export const DEVICE_RESUME = createAction('DEVICE_RESUME')

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
