import featureFlagsReducer, { initialState } from './'

import { UPDATE_FEATURE_FLAGS } from 'state/actions/feature-flags'

describe('Feature flags reducer', () => {
  const reducerTest = reducerTester(featureFlagsReducer)

  it('returns the initial state by default', () => {
    reducerTest(undefined, {}, initialState)
  })

  it('updates state on UPDATE_FEATURE_FLAGS without rollout info', () => {
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

  it('updates state on UPDATE_FEATURE_FLAGS with rollout info', () => {
    const expectedState = {
      featureFlags: [
        {
          lastUpdatedOn: '2020-06-08',
          name: 'appstore-reviews-request',
          page: 'commissioning-success',
          status: true,
          rollout: {
            criteria: 'all',
            dealerName: ['SunPower Global', 'Gabi Solar'],
            permissions: [
              'DEVICE_OVERVIEW_SEARCH',
              'EDIT_CT_SCALING_FACTOR',
              'EDIT_DCM_BILL_PERIOD',
              'EDIT_DCM_CONTROLLER_MODE'
            ],
            userGroup: ['Employee', 'Admin', 'Installer']
          }
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
            status: true,
            rollout: {
              criteria: 'all',
              dealerName: ['SunPower Global', 'Gabi Solar'],
              permissions: [
                'DEVICE_OVERVIEW_SEARCH',
                'EDIT_CT_SCALING_FACTOR',
                'EDIT_DCM_BILL_PERIOD',
                'EDIT_DCM_CONTROLLER_MODE'
              ],
              userGroup: ['Employee', 'Admin', 'Installer']
            }
          }
        ],
        timestamp: 1625589403426,
        status: 'fetched'
      }),
      expectedState
    )
  })
})
