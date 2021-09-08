import featureFlagsReducer, { initialState } from './'

import { UPDATE_FEATURE_FLAGS } from 'state/actions/feature-flags'

describe('Feature flags reducer', () => {
  const reducerTest = reducerTester(featureFlagsReducer)

  it('returns the initial state by default', () => {
    reducerTest(undefined, {}, initialState)
  })

  it('updates state on UPDATE_FEATURE_FLAGS', () => {
    const expectedState = {
      featureFlags: [
        {
          lastUpdatedOn: '2020-06-08',
          name: 'appstore-reviews-request',
          page: 'commissioning-success',
          status: true
        }
      ],
      lastSuccessfulUpdateOn: 1625589403426,
      status: 'fetched'
    }

    reducerTest(
      initialState,
      UPDATE_FEATURE_FLAGS({
        featureFlags: [
          {
            lastUpdatedOn: '2020-06-08',
            name: 'appstore-reviews-request',
            page: 'commissioning-success',
            status: true
          }
        ],
        timestamp: 1625589403426,
        status: 'fetched'
      }),
      expectedState
    )
  })
})
