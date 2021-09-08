import { of, throwError } from 'rxjs'

import { updateFeatureFlagsEpic } from './updateFeatureFlagsEpic'

import { UpdateFeatureFlagsError } from 'shared/errors'
import { LOGIN_SUCCESS } from 'state/actions/auth'
import {
  UPDATE_FEATURE_FLAGS,
  UPDATE_FEATURE_FLAGS_ERROR
} from 'state/actions/feature-flags'
import { DEVICE_RESUME } from 'state/actions/mobile'

describe('updateFeatureFlagsEpic', function() {
  const mockFeatureFlagsResponse = {
    meta: {
      version: '1.0.0'
    },
    featureFlags: [
      {
        page: 'commissioning-success',
        name: 'appstore-reviews-request',
        statuses: [
          {
            platform: 'android',
            status: true
          },
          {
            platform: 'ios',
            status: true
          }
        ],
        meta: {
          date: '2020-06-08',
          description: '',
          tickets: ['https://sunpowercorp.atlassian.net/browse/CM2-2243'],
          'modified-by': 'Alvin Cheung'
        }
      }
    ]
  }
  let epicTest

  beforeEach(function() {
    epicTest = undefined
  })

  it('must emit EMPTY if LOGIN_SUCCESS and time since last update is less than DELAY_BEFORE_UPDATE', () => {
    // 4 minutes after lastSuccessfulUpdateOn, DELAY_BEFORE_UPDATE is set to 5 minutes
    jest.spyOn(Date, 'now').mockImplementation(() => 1625589283426)
    epicTest = epicTester(updateFeatureFlagsEpic)
    const dependencies = {
      getJSON: () => of(mockFeatureFlagsResponse)
    }

    const inputMarble = 'a'
    const inputValues = {
      a: LOGIN_SUCCESS()
    }
    const expectedMarble = ''
    const expectedValues = {}

    epicTest(
      inputMarble,
      expectedMarble,
      inputValues,
      expectedValues,
      {
        featureFlags: {
          lastSuccessfulUpdateOn: 1625589043426
        }
      },
      dependencies
    )
  })

  it('must emit EMPTY if DEVICE_RESUME and time since last update is less than DELAY_BEFORE_UPDATE', () => {
    // 4 minutes after lastSuccessfulUpdateOn, DELAY_BEFORE_UPDATE is set to 5 minutes
    jest.spyOn(Date, 'now').mockImplementation(() => 1625589283426)
    epicTest = epicTester(updateFeatureFlagsEpic)
    const dependencies = {
      getJSON: () => of(mockFeatureFlagsResponse)
    }

    const inputMarble = 'a'
    const inputValues = {
      a: DEVICE_RESUME()
    }
    const expectedMarble = ''
    const expectedValues = {}

    epicTest(
      inputMarble,
      expectedMarble,
      inputValues,
      expectedValues,
      {
        featureFlags: {
          lastSuccessfulUpdateOn: 1625589043426
        }
      },
      dependencies
    )
  })

  it('must emit UPDATE_FEATURE_FLAGS if LOGIN_SUCCESS and feature flags have never been fetched', () => {
    // 6 minutes after lastSuccessfulUpdateOn, DELAY_BEFORE_UPDATE is set to 5 minutes
    jest.spyOn(Date, 'now').mockImplementation(() => 1625589403426)
    epicTest = epicTester(updateFeatureFlagsEpic)
    const dependencies = {
      getJSON: () => of(mockFeatureFlagsResponse)
    }

    const inputMarble = 'a'
    const inputValues = {
      a: LOGIN_SUCCESS()
    }
    const expectedMarble = 'a'
    const expectedValues = {
      a: UPDATE_FEATURE_FLAGS({
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
      })
    }

    epicTest(
      inputMarble,
      expectedMarble,
      inputValues,
      expectedValues,
      {
        featureFlags: {
          lastSuccessfulUpdateOn: 0,
          status: 'neverFetched'
        }
      },
      dependencies
    )
  })

  it('must emit UPDATE_FEATURE_FLAGS if LOGIN_SUCCESS and time since last update is equal or greater than DELAY_BEFORE_UPDATE', () => {
    // 6 minutes after lastSuccessfulUpdateOn, DELAY_BEFORE_UPDATE is set to 5 minutes
    jest.spyOn(Date, 'now').mockImplementation(() => 1625589403426)
    epicTest = epicTester(updateFeatureFlagsEpic)
    const dependencies = {
      getJSON: () => of(mockFeatureFlagsResponse)
    }

    const inputMarble = 'a'
    const inputValues = {
      a: LOGIN_SUCCESS()
    }
    const expectedMarble = 'a'
    const expectedValues = {
      a: UPDATE_FEATURE_FLAGS({
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
      })
    }

    epicTest(
      inputMarble,
      expectedMarble,
      inputValues,
      expectedValues,
      {
        featureFlags: {
          lastSuccessfulUpdateOn: 1625589043426
        }
      },
      dependencies
    )
  })

  it('must emit UPDATE_FEATURE_FLAGS if DEVICE_RESUME and time since last update is equal or greater than DELAY_BEFORE_UPDATE', () => {
    // 6 minutes after lastSuccessfulUpdateOn, DELAY_BEFORE_UPDATE is set to 5 minutes
    jest.spyOn(Date, 'now').mockImplementation(() => 1625589403426)
    epicTest = epicTester(updateFeatureFlagsEpic)
    const dependencies = {
      getJSON: () => of(mockFeatureFlagsResponse)
    }

    const inputMarble = 'a'
    const inputValues = {
      a: DEVICE_RESUME()
    }
    const expectedMarble = 'a'
    const expectedValues = {
      a: UPDATE_FEATURE_FLAGS({
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
      })
    }

    epicTest(
      inputMarble,
      expectedMarble,
      inputValues,
      expectedValues,
      {
        featureFlags: {
          lastSuccessfulUpdateOn: 1625589043426
        }
      },
      dependencies
    )
  })

  it('must emit UPDATE_FEATURE_FLAGS_ERROR if an error occurs when requesting feature flags update', () => {
    // 6 minutes after lastSuccessfulUpdateOn, DELAY_BEFORE_UPDATE is set to 5 minutes
    jest.spyOn(Date, 'now').mockImplementation(() => 1625589403426)
    epicTest = epicTester(updateFeatureFlagsEpic)
    const error = new UpdateFeatureFlagsError(
      'An error occurred while updating feature flags'
    )
    const dependencies = {
      getJSON: () => throwError(error)
    }

    const inputMarble = 'a'
    const inputValues = {
      a: DEVICE_RESUME()
    }
    const expectedMarble = 'a'
    const expectedValues = {
      a: UPDATE_FEATURE_FLAGS_ERROR(error)
    }

    epicTest(
      inputMarble,
      expectedMarble,
      inputValues,
      expectedValues,
      {
        featureFlags: {
          lastSuccessfulUpdateOn: 1625589043426
        }
      },
      dependencies
    )
  })
})
