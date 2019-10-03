import { createAction } from 'redux-act'
import { httpGet } from '../../shared/fetch'

export const ALERTS_FETCH_INIT = createAction('ALERTS_FETCH_INIT')
export const ALERTS_FETCH_SUCCESS = createAction('ALERTS_FETCH_SUCCESS')
export const ALERTS_FETCH_ERROR = createAction('ALERTS_FETCH_ERROR')

let alertsPollTimer
const ALERTS_POLL_INTERVAL = 1000 * 60

export const pollAlerts = () => {
  return (dispatch, getState) => {
    const callback = async () => {
      const state = getState()
      const isLoggedIn = !!state.user.auth.tokenID

      if (alertsPollTimer && !isLoggedIn) {
        clearInterval(alertsPollTimer)
        return
      }

      const addressId = state.user.auth.addressId

      try {
        dispatch(ALERTS_FETCH_INIT())
        const { status, data } = await httpGet(
          `/address/${addressId}/alerts`,
          state
        )
        return status === 200
          ? dispatch(ALERTS_FETCH_SUCCESS(data))
          : dispatch(ALERTS_FETCH_ERROR(data))
      } catch (err) {
        dispatch(ALERTS_FETCH_ERROR(err))
      }
    }

    if (!alertsPollTimer) {
      callback()
      alertsPollTimer = setInterval(callback, ALERTS_POLL_INTERVAL)
    }
  }
}
export const ALERTS_STOP_POLLING_INIT = createAction('ALERTS_STOP_POLLING_INIT')
export const ALERTS_STOP_POLLING_SUCCESS = createAction(
  'ALERTS_STOP_POLLING_SUCCESS'
)

export const stopPollingAlerts = () => {
  return dispatch => {
    dispatch(ALERTS_STOP_POLLING_INIT())
    if (alertsPollTimer) {
      clearInterval(alertsPollTimer)
      dispatch(ALERTS_STOP_POLLING_SUCCESS())
      return
    }
  }
}

export const ALERTS_DISMISS = createAction('ALERTS_DISMISS')
export const ALERTS_SEEN = createAction('ALERTS_SEEN')
