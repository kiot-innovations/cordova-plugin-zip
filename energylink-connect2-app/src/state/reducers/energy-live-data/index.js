import { createReducer } from 'redux-act'
import {
  LIVE_ENERGY_DATA_NOTIFICATION,
  LIVE_ENERGY_DATA_DAILY
} from '../../actions/energy-data'

const initialState = {
  dailyData: {},
  liveData: {}
}
const TOTAL_POINTS = 60 // 1 minute
export const energyLiveData = createReducer(
  {
    [LIVE_ENERGY_DATA_DAILY]: (state, payload) => ({
      ...state,
      dailyData: payload
    }),
    [LIVE_ENERGY_DATA_NOTIFICATION]: (state, payload) => {
      const entries = Object.entries(state.liveData)

      entries.push(Object.entries(payload).pop())

      if (entries.length > TOTAL_POINTS) {
        entries.shift()
      }

      return { ...state, liveData: Object.fromEntries(entries) }
    }
  },
  initialState
)
