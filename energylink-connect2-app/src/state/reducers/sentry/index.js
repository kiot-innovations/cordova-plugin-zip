import { createReducer } from 'redux-act'
import { tail } from 'ramda'
import { SENTRY_QUEUE_EVENT, SENTRY_UNQUEUE_EVENT } from 'state/actions/sentry'

const initialState = {
  pendingEvents: []
}

const sentryReducer = createReducer(
  {
    [SENTRY_QUEUE_EVENT]: (state, event) => ({
      ...state,
      pendingEvents: [...state.pendingEvents, event]
    }),
    [SENTRY_UNQUEUE_EVENT]: state => ({
      ...state,
      pendingEvents: tail(state.pendingEvents)
    })
  },
  initialState
)

export default sentryReducer
