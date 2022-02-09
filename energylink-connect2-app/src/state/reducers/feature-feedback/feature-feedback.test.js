import featureFeedbackReducer, { initialState } from './'

import { FEATURE_FEEDBACK_MODAL_OPEN } from 'state/actions/feedback'

describe('Feature feedback reducer', () => {
  const reducerTest = reducerTester(featureFeedbackReducer)

  it('returns the initial state by default', () => {
    reducerTest(undefined, {}, initialState)
  })

  it('updates state on FEATURE_FEEDBACK_MODAL_OPEN', () => {
    const expectedState = {
      alreadyShownModals: ['ct-checks']
    }

    reducerTest(
      initialState,
      FEATURE_FEEDBACK_MODAL_OPEN({
        featureFlagName: 'ct-checks'
      }),
      expectedState
    )
  })
})
