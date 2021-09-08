import { createReducer } from 'redux-act'

import { status } from 'shared/featureFlags'
import { UPDATE_FEATURE_FLAGS } from 'state/actions/feature-flags'

const { NEVER_FETCHED } = status

export const initialState = {
  featureFlags: [],
  lastSuccessfulUpdateOn: 0,
  status: NEVER_FETCHED
}

export default createReducer(
  {
    [UPDATE_FEATURE_FLAGS]: (state, { featureFlags, timestamp, status }) => ({
      ...state,
      featureFlags: featureFlags,
      lastSuccessfulUpdateOn: timestamp,
      status: status
    })
  },
  initialState
)
