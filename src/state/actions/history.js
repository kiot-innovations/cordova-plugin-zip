import { createAction } from 'redux-act'

export const CHANGE_INTERVAL_INIT = createAction('CHANGE_INTERVAL_INIT')
export const CHANGE_INTERVAL = createAction('CHANGE_INTERVAL')
export const CHANGE_INTERVAL_DELTA = createAction('CHANGE_INTERVAL_DELTA')
export const CHANGE_INTERVAL_SUCCESS = createAction('CHANGE_INTERVAL_SUCCESS')
export const CHANGE_INTERVAL_ERROR = createAction('CHANGE_INTERVAL_ERROR')

export const INTERVAL_DELTA = {
  DAY: 'DAY',
  WEEK: 'WEEK',
  MONTH: 'MONTH',
  YEAR: 'YEAR',
  LIFETIME: 'LIFETIME',
  CUSTOM: 'CUSTOM'
}

export const changeDatePeriod = datePeriod => {
  return dispatch => {
    try {
      dispatch(CHANGE_INTERVAL_INIT())
      dispatch(CHANGE_INTERVAL_DELTA(datePeriod))
      dispatch(CHANGE_INTERVAL_SUCCESS())
    } catch (err) {
      dispatch(CHANGE_INTERVAL_ERROR(err))
    }
  }
}
