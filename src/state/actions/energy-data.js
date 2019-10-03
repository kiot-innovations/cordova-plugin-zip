import moment from 'moment'
import { createAction } from 'redux-act'
import { httpGet } from '../../shared/fetch'
import { roundDecimals } from '../../shared/rounding'

export const GET_ENERGY_DATA_INIT = createAction('GET_ENERGY_DATA_INIT')
export const GET_ENERGY_DATA_SUCCESS = createAction('GET_ENERGY_DATA_SUCCESS')
export const GET_ENERGY_DATA_ERROR = createAction('GET_ENERGY_DATA_ERROR')

export const INTERVALS = {
  HOUR: 'hour',
  DAY: 'day',
  MONTH: 'month'
}

// Minimum amount of time that has to pass before fetching more data
export const DELTAS = {
  [INTERVALS.HOUR]: 1000 * 60 * 5 /* 5 minutes */,
  [INTERVALS.DAY]: 1000 * 60 * 30 /* 30 minutes */,
  [INTERVALS.MONTH]: 1000 * 60 * 60 * 12 /* 12 hours */
}

const timers = {}

export const ENERGY_DATA_STOP_POLLING_INIT = createAction(
  'ENERGY_DATA_STOP_POLLING_INIT'
)
export const ENERGY_DATA_STOP_POLLING_SUCCESS = createAction(
  'ENERGY_DATA_STOP_POLLING_SUCCESS'
)

export const stopPollingEnergyData = () => {
  return async dispatch => {
    dispatch(ENERGY_DATA_STOP_POLLING_INIT())
    Object.values(INTERVALS).forEach(i => {
      if (timers[i]) {
        clearInterval(timers[i])
        timers[i] = null
      }
    })
    dispatch(ENERGY_DATA_STOP_POLLING_SUCCESS())
  }
}

export const pollEnergyData = (
  interval = INTERVALS.HOUR,
  defaultstarttime = moment()
    .subtract(1, 'day')
    .valueOf()
) => {
  return async (dispatch, getState) => {
    const delta = DELTAS[interval]
    const pollFn = () => {
      const state = getState()
      const currentTimestamp = moment().valueOf()
      const lastDataTimestamp =
        state.energyData &&
        state.energyData[interval] &&
        state.energyData[interval].endtime
          ? state.energyData[interval].endtime
          : defaultstarttime

      const hasOutdatedData = currentTimestamp - lastDataTimestamp >= delta

      if (hasOutdatedData) {
        dispatch(
          getEnergyData(lastDataTimestamp - delta, currentTimestamp, interval)
        )
      }
    }

    if (!timers[interval]) {
      pollFn()
      timers[interval] = setInterval(pollFn, delta)
    }
  }
}

export const getEnergyData = (
  starttime,
  endtime,
  interval = INTERVALS.HOUR
) => {
  return async (dispatch, getState) => {
    try {
      endtime = endtime || moment().valueOf()
      starttime =
        starttime ||
        moment(endtime)
          .subtract(1, 'day')
          .valueOf()

      dispatch(GET_ENERGY_DATA_INIT({ interval }))
      const state = getState()
      const params = Object.entries({
        interval,
        starttime,
        endtime
      })
        .map(v => v.join('='))
        .join('&')

      const { status, data } = await httpGet(
        `/address/${state.user.auth.addressId}/mockenergy?${params}`,
        state
      )

      if (status !== 200) {
        dispatch(GET_ENERGY_DATA_ERROR(data))
        return
      }
      dispatch(
        GET_ENERGY_DATA_SUCCESS({
          starttime,
          endtime,
          interval,
          data
        })
      )
      dispatch(normalizeEnergyData(starttime, endtime, interval, data))
    } catch (error) {
      dispatch(GET_ENERGY_DATA_ERROR({ interval, error }))
    }
  }
}

export const NORMALIZE_ENERGY_DATA_SUCCESS = createAction(
  'NORMALIZE_ENERGY_DATA_SUCCESS'
)

const parseNumber = value => roundDecimals(parseFloat(value || 0))

export const normalizeEnergyData = (starttime, endtime, interval, data) => {
  return dispatch => {
    const normalizedData = data.reduce((acc, curr) => {
      /*
        pp = power production
        pc = power consumption
        ps = storage power
        p = production
        c = consumption
        s = storage
        soc = state of charge
        weather = storage
      */
      const [timestamp, pp, pc, ps, p, c, s, soc, weather] = curr.split(',')
      return {
        ...acc,
        [timestamp]: {
          pp: parseNumber(pp),
          pc: parseNumber(pc),
          ps: parseNumber(ps),
          p: parseNumber(p),
          c: parseNumber(c),
          s: parseNumber(s),
          soc: parseNumber(soc),
          weather
        }
      }
    }, {})

    dispatch(
      NORMALIZE_ENERGY_DATA_SUCCESS({
        starttime,
        endtime,
        interval,
        normalizedData
      })
    )
  }
}
