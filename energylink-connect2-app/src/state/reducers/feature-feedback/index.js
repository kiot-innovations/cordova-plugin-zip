import { createReducer } from 'redux-act'

import { FEATURE_FEEDBACK_MODAL_OPEN } from 'state/actions/feedback'

export const initialState = {
  alreadyShownModals: []
}

export default createReducer(
  {
    [FEATURE_FEEDBACK_MODAL_OPEN]: (
      { alreadyShownModals },
      { featureFlagName }
    ) => ({
      alreadyShownModals: [...alreadyShownModals, featureFlagName]
    })
  },
  initialState
)
