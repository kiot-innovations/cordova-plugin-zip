import { createAction } from 'redux-act'

export const FETCH_LTE_DATA_INIT = createAction('FETCH_LTE_DATA_INIT')
export const FETCH_LTE_DATA_SUCCESS = createAction('FETCH_LTE_DATA_SUCCESS')
export const FETCH_LTE_DATA_ERROR = createAction('FETCH_LTE_DATA_ERROR')

export const FETCH_CURRENT_POWER_INIT = createAction('FETCH_CURRENT_POWER_INIT')
export const FETCH_CURRENT_POWER_SUCCESS = createAction(
  'FETCH_CURRENT_POWER_SUCCESS'
)
export const FETCH_CURRENT_POWER_ERROR = createAction(
  'FETCH_CURRENT_POWER_ERROR'
)

export const GET_ENERGY_DATA_INIT = createAction('GET_ENERGY_DATA_INIT')
export const GET_ENERGY_DATA_SUCCESS = createAction('GET_ENERGY_DATA_SUCCESS')
export const GET_ENERGY_DATA_ERROR = createAction('GET_ENERGY_DATA_ERROR')

export const LIVE_ENERGY_DATA_NOTIFICATION = createAction(
  'LIVE_ENERGY_DATA_NOTIFICATION'
)
export const LIVE_ENERGY_DATA_DAILY = createAction('LIVE_ENERGY_DATA_DAILY')
export const LIVE_ENERGY_DATA_CONNECTION = createAction(
  'LIVE_ENERGY_DATA_CONNECTION'
)
export const LIVE_ENERGY_DATA_ERROR = createAction('LIVE_ENERGY_DATA_ERROR')

export const GET_POWER_DATA_INIT = createAction('GET_POWER_DATA_INIT')
export const GET_POWER_DATA_SUCCESS = createAction('GET_POWER_DATA_SUCCESS')
export const GET_POWER_DATA_ERROR = createAction('GET_POWER_DATA_ERROR')

export const INTERVALS = {
  FIVE_MINUTE: 'five_minute',
  QUARTER_HOUR: 'quarter_hour',
  HOUR: 'hour',
  DAY: 'day',
  MONTH: 'month',
  YEAR: 'year',
  LIVE: 'live'
}

// Minimum amount of time that has to pass before fetching more data
export const DELTAS = {
  [INTERVALS.HOUR]: 1000 * 60 * 5 /* 5 minutes */,
  [INTERVALS.DAY]: 1000 * 60 * 30 /* 30 minutes */,
  [INTERVALS.MONTH]: 1000 * 60 * 60 * 12 /* 12 hours */,
  [INTERVALS.YEAR]: 1000 * 60 * 60 * 24 * 7 /* 1 week */
}

export const ENERGY_DATA_START_POLLING = createAction(
  'ENERGY_DATA_START_POLLING'
)
export const ENERGY_DATA_POLLING = createAction('ENERGY_DATA_POLLING')
export const ENERGY_DATA_STOP_POLLING = createAction('ENERGY_DATA_STOP_POLLING')

export const POWER_DATA_START_POLLING = createAction('POWER_DATA_START_POLLING')
export const POWER_DATA_POLLING = createAction('POWER_DATA_POLLING')
export const POWER_DATA_STOP_POLLING = createAction('POWER_DATA_STOP_POLLING')

export const CURRENT_POWER_DATA_START_POLLING = createAction(
  'CURRENT_POWER_DATA_START_POLLING'
)
export const CURRENT_POWER_DATA_STOP_POLLING = createAction(
  'CURRENT_POWER_DATA_STOP_POLLING'
)

export const NORMALIZE_ENERGY_DATA_INIT = createAction(
  'NORMALIZE_ENERGY_DATA_INIT'
)
export const NORMALIZE_ENERGY_DATA_SUCCESS = createAction(
  'NORMALIZE_ENERGY_DATA_SUCCESS'
)

export const NORMALIZE_POWER_DATA_INIT = createAction(
  'NORMALIZE_POWER_DATA_INIT'
)
export const NORMALIZE_POWER_DATA_SUCCESS = createAction(
  'NORMALIZE_POWER_DATA_SUCCESS'
)

export const LTE_DATA_POLL_START = createAction('LTE_DATA_POLL_START')
export const LTE_DATA_POLL_STOP = createAction('LTE_DATA_POLL_STOP')
