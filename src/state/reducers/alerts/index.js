import { createReducer } from 'redux-act'
import {
  ALERTS_FETCH_SUCCESS,
  ALERTS_DISMISS,
  ALERTS_SEEN
} from '../../actions/alerts'
import { LOGOUT } from '../../actions/auth'

const initialState = {
  data: {}
}

export const alertsReducer = createReducer(
  {
    [ALERTS_FETCH_SUCCESS]: (state, { unresolvedAlerts }) => ({
      ...state,
      data: {
        ...state.data,
        ...unresolvedAlerts
          .map(newAlert => {
            const id = newAlert.AlertsID
            const existingAlert = state.data[id] || {}
            const seenTimestamp =
              state.data[id] && state.data[id].seenTimestamp
                ? state.data[id].seenTimestamp
                : null
            return { [id]: { ...existingAlert, ...newAlert, seenTimestamp } }
          })
          .reduce((acc, curr) => ({ ...acc, ...curr }), {})
      }
    }),
    [ALERTS_DISMISS]: (state, payload) => ({
      ...state,
      data: {
        ...state.data,
        ...{ [payload]: { ...state.data[payload], dismissed: true } }
      }
    }),
    [ALERTS_SEEN]: state => ({
      ...state,
      data: Object.keys(state.data)
        .map(key => {
          const newAlert = {
            [key]: {
              ...state.data[key],
              seenTimestamp: Date.now().valueOf()
            }
          }
          return newAlert
        })
        .reduce((acc, curr) => ({ ...acc, ...curr }), {})
    }),
    [LOGOUT]: () => initialState
  },
  initialState
)
