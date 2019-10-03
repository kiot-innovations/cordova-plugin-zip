import { createReducer } from 'redux-act'
import {
  NORMALIZE_ENERGY_DATA_SUCCESS,
  INTERVALS,
  GET_ENERGY_DATA_INIT,
  GET_ENERGY_DATA_ERROR
} from '../../actions/energy-data'
import { LOGIN_SUCCESS } from '../../actions/auth'

const initialState = {
  [INTERVALS.HOUR]: { starttime: 0, endtime: 0, data: {} },
  [INTERVALS.DAY]: { starttime: 0, endtime: 0, data: {} },
  [INTERVALS.MONTH]: { starttime: 0, endtime: 0, data: {} },
  isLoading: {
    [INTERVALS.HOUR]: false,
    [INTERVALS.DAY]: false,
    [INTERVALS.MONTH]: false
  }
}

export const energyDataReducer = createReducer(
  {
    [LOGIN_SUCCESS]: (state, { addressId }) => ({
      ...state,
      siteId: addressId,
      ...(state.siteId !== addressId ? initialState : {})
    }),
    [GET_ENERGY_DATA_INIT]: (state, { interval }) => ({
      ...state,
      [interval]: {
        ...state[interval]
      },
      isLoading: {
        ...state.isLoading,
        [interval]: true
      }
    }),
    [GET_ENERGY_DATA_ERROR]: (state, { interval }) => ({
      ...state,
      [interval]: {
        ...state[interval]
      },
      isLoading: {
        ...state.isLoading,
        [interval]: false
      }
    }),
    [NORMALIZE_ENERGY_DATA_SUCCESS]: (
      state,
      { starttime, endtime, interval, normalizedData }
    ) => {
      return {
        ...state,
        [interval]: {
          starttime,
          endtime,
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
    }
  },
  initialState
)
