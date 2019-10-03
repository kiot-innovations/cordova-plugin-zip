import { createReducer } from 'redux-act'
import moment from 'moment'
import {
  CHANGE_INTERVAL_INIT,
  CHANGE_INTERVAL,
  CHANGE_INTERVAL_DELTA,
  CHANGE_INTERVAL_SUCCESS
} from '../../actions/history'

const currentDate = moment()
const initialState = {
  intervalDelta: 'DAY',
  interval: [
    moment(currentDate).startOf('day'),
    moment(currentDate).endOf('day')
  ],
  changingInterval: false
}

export const historyReducer = createReducer(
  {
    [CHANGE_INTERVAL_INIT]: state => ({
      ...state,
      changingInterval: true
    }),
    [CHANGE_INTERVAL]: (state, { interval }) => ({
      ...state,
      interval
    }),
    [CHANGE_INTERVAL_DELTA]: (state, intervalDelta) => ({
      ...state,
      intervalDelta: intervalDelta
    }),
    [CHANGE_INTERVAL_SUCCESS]: state => ({
      ...state,
      changingInterval: false
    })
  },
  initialState
)
