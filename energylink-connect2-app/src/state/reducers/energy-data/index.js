import { createReducer } from 'redux-act'

import { LOGIN_SUCCESS } from '../../actions/auth'
import {
  NORMALIZE_ENERGY_DATA_SUCCESS,
  NORMALIZE_POWER_DATA_SUCCESS,
  INTERVALS,
  GET_ENERGY_DATA_INIT,
  GET_ENERGY_DATA_ERROR,
  GET_POWER_DATA_INIT,
  GET_POWER_DATA_ERROR,
  FETCH_LTE_DATA_INIT,
  FETCH_LTE_DATA_SUCCESS,
  FETCH_LTE_DATA_ERROR,
  ENERGY_DATA_STOP_POLLING,
  ENERGY_DATA_POLLING,
  FETCH_CURRENT_POWER_INIT,
  FETCH_CURRENT_POWER_SUCCESS,
  FETCH_CURRENT_POWER_ERROR,
  POWER_DATA_POLLING,
  POWER_DATA_STOP_POLLING,
  CURRENT_POWER_DATA_STOP_POLLING,
  LTE_DATA_POLL_STOP
} from '../../actions/energy-data'

const initialState = {
  [INTERVALS.HOUR]: { startTime: 0, endTime: 0, data: {}, powerData: {} },
  [INTERVALS.DAY]: { startTime: 0, endTime: 0, data: {}, powerData: {} },
  [INTERVALS.MONTH]: { startTime: 0, endTime: 0, data: {}, powerData: {} },
  [INTERVALS.YEAR]: { startTime: 0, endTime: 0, data: {}, powerData: {} },
  isLoading: {
    [INTERVALS.HOUR]: false,
    [INTERVALS.DAY]: false,
    [INTERVALS.MONTH]: false,
    [INTERVALS.YEAR]: false
  },
  isLoadingPower: {
    [INTERVALS.HOUR]: false,
    [INTERVALS.DAY]: false,
    [INTERVALS.MONTH]: false,
    [INTERVALS.YEAR]: false
  },
  isPolling: {
    [INTERVALS.HOUR]: false,
    [INTERVALS.DAY]: false,
    [INTERVALS.MONTH]: false,
    [INTERVALS.YEAR]: false
  },
  isPollingPower: {
    [INTERVALS.HOUR]: false,
    [INTERVALS.DAY]: false,
    [INTERVALS.MONTH]: false,
    [INTERVALS.YEAR]: false
  },
  isPollingCurrentPower: false,
  isPollingLTD: false,
  lte: {
    energyProduction: [],
    energyConsumption: [],
    unit: 'kilowatt_hour'
  },
  currentPower: {
    production: 0,
    consumption: 0,
    storage: 0
  },
  isGettingLTEData: false,
  isGettingCurrentPower: false
}

export const energyDataReducer = createReducer(
  {
    [LOGIN_SUCCESS]: (state, { addressId }) => ({
      ...state,
      siteId: addressId,
      ...(state.siteId !== addressId ? initialState : {})
    }),
    [ENERGY_DATA_POLLING]: (state, { interval }) => ({
      ...state,
      isPolling: {
        ...state.isPolling,
        [interval]: true
      }
    }),
    [ENERGY_DATA_STOP_POLLING]: state => ({
      ...state,
      isPolling: initialState.isPolling
    }),
    [POWER_DATA_POLLING]: (state, { interval }) => ({
      ...state,
      isPollingPower: {
        ...state.isPollingPower,
        [interval]: true
      }
    }),
    [POWER_DATA_STOP_POLLING]: state => ({
      ...state,
      isPollingPower: initialState.isPollingPower
    }),
    [GET_ENERGY_DATA_INIT]: (state, { interval }) => ({
      ...state,
      isLoading: {
        ...state.isLoading,
        [interval]: true
      }
    }),
    [GET_POWER_DATA_INIT]: (state, { interval }) => ({
      ...state,
      isLoadingPower: {
        ...state.isLoadingPower,
        [interval]: true
      }
    }),
    [GET_ENERGY_DATA_ERROR]: (state, { interval }) => ({
      ...state,
      isLoading: {
        ...state.isLoading,
        [interval]: false
      }
    }),
    [GET_POWER_DATA_ERROR]: (state, { interval }) => ({
      ...state,
      isLoadingPower: {
        ...state.isLoadingPower,
        [interval]: false
      }
    }),
    [NORMALIZE_ENERGY_DATA_SUCCESS]: (
      state,
      { startTime, endTime, interval, normalizedData }
    ) => {
      return {
        ...state,
        [interval]: {
          ...state[interval],
          startTime,
          endTime,
          data: Object.fromEntries(
            Object.entries({
              ...state[interval].data,
              ...normalizedData
            }).sort(([k1], [k2]) => (k1 > k2 ? 1 : -1))
          )
        },
        isLoading: {
          ...state.isLoading,
          [interval]: false
        }
      }
    },
    [NORMALIZE_POWER_DATA_SUCCESS]: (
      state,
      { startTime, endTime, interval, normalizedData }
    ) => {
      return {
        ...state,
        [interval]: {
          ...state[interval],
          startTime,
          endTime,
          powerData: Object.fromEntries(
            Object.entries({
              ...state[interval].powerData,
              ...normalizedData
            }).sort(([k1], [k2]) => (k1 > k2 ? 1 : -1))
          )
        },
        isLoadingPower: {
          ...state.isLoadingPower,
          [interval]: false
        }
      }
    },
    [FETCH_LTE_DATA_INIT]: state => ({
      ...state,
      isGettingLTEData: true,
      isPollingLTD: true
    }),
    [FETCH_LTE_DATA_SUCCESS]: (state, payload) => ({
      ...state,
      isGettingLTEData: false,
      lte: payload
    }),
    [FETCH_LTE_DATA_ERROR]: state => ({
      ...state,
      isGettingLTEData: false,
      lte: initialState.lte
    }),
    [FETCH_CURRENT_POWER_INIT]: state => ({
      ...state,
      isGettingCurrentPower: true,
      isPollingCurrentPower: true,
      currentPower: initialState.currentPower
    }),
    [FETCH_CURRENT_POWER_SUCCESS]: (state, payload) => ({
      ...state,
      isGettingCurrentPower: false,
      currentPower: payload
    }),
    [FETCH_CURRENT_POWER_ERROR]: state => ({
      ...state,
      isGettingCurrentPower: false,
      currentPower: initialState.currentPower
    }),
    [CURRENT_POWER_DATA_STOP_POLLING]: state => ({
      ...state,
      isPollingCurrentPower: false
    }),
    [LTE_DATA_POLL_STOP]: state => ({
      ...state,
      isPollingLTD: false
    })
  },
  initialState
)
