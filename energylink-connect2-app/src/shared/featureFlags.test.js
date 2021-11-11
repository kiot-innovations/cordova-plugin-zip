import * as reactRedux from 'react-redux'

import {
  getLastSuccessfulUpdate,
  getCurrentDevicePlatformStatus,
  getParsedFeatureFlags,
  useFeatureFlag
} from './featureFlags'

describe('getLastSuccessfulUpdate', () => {
  it('should get the last successful timestamp from RxJS state$', function() {
    const state$ = {
      value: { featureFlags: { lastSuccessfulUpdateOn: 1625516616897 } }
    }
    const result = getLastSuccessfulUpdate(state$)

    expect(result).toEqual(1625516616897)
  })

  it('should default to 0 if unable to get last successful timestamp from RxJS state$', function() {
    const state$ = {
      value: {}
    }
    const result = getLastSuccessfulUpdate(state$)

    expect(result).toEqual(0)
  })
})

describe('getCurrentDevicePlatformStatus', () => {
  it('should be true for iOS when feature flag is enabled', function() {
    window.device = { platform: 'iOS' }
    const statuses = [
      {
        platform: 'android',
        status: false
      },
      {
        platform: 'ios',
        status: true
      }
    ]
    const result = getCurrentDevicePlatformStatus(statuses)

    expect(result).toEqual(true)
  })

  it('should be true for Android when feature flag is enabled', function() {
    window.device = { platform: 'Android' }
    const statuses = [
      {
        platform: 'android',
        status: true
      },
      {
        platform: 'ios',
        status: false
      }
    ]
    const result = getCurrentDevicePlatformStatus(statuses)

    expect(result).toEqual(true)
  })

  it('should be false for iOS when feature flag is not defined', function() {
    window.device = { platform: 'iOS' }
    const statuses = [
      {
        platform: 'android',
        status: true
      }
    ]
    const result = getCurrentDevicePlatformStatus(statuses)

    expect(result).toEqual(false)
  })

  it('should be false for Android when feature flag is not defined', function() {
    window.device = { platform: 'Android' }
    const statuses = [
      {
        platform: 'ios',
        status: true
      }
    ]
    const result = getCurrentDevicePlatformStatus(statuses)

    expect(result).toEqual(false)
  })
})

describe('getParsedFeatureFlags', () => {
  it('should get an array of parsed feature flags for iOS', function() {
    window.device = { platform: 'iOS' }
    const featureFlags = {
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
              status: false
            },
            {
              platform: 'ios',
              status: true
            }
          ],
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
          },
          meta: {
            date: '2020-06-08',
            description: '',
            tickets: ['https://sunpowercorp.atlassian.net/browse/CM2-2243'],
            'modified-by': 'Alvin Cheung'
          }
        },
        {
          page: 'commissioning-success',
          name: 'a-different-feature-flag',
          statuses: [
            {
              platform: 'android',
              status: false
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
    const parsedFeatureFlags = [
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
      },
      {
        lastUpdatedOn: '2020-06-08',
        name: 'a-different-feature-flag',
        page: 'commissioning-success',
        status: true,
        rollout: {}
      }
    ]
    const result = getParsedFeatureFlags(featureFlags)

    expect(result).toEqual(parsedFeatureFlags)
  })

  it('should get an array of parsed feature flags for Android', function() {
    window.device = { platform: 'Android' }
    const featureFlags = {
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
              status: false
            }
          ],
          meta: {
            date: '2020-06-08',
            description: '',
            tickets: ['https://sunpowercorp.atlassian.net/browse/CM2-2243'],
            'modified-by': 'Alvin Cheung'
          }
        },
        {
          page: 'commissioning-success',
          name: 'a-different-feature-flag',
          statuses: [
            {
              platform: 'android',
              status: true
            },
            {
              platform: 'ios',
              status: false
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
    const parsedFeatureFlags = [
      {
        lastUpdatedOn: '2020-06-08',
        name: 'appstore-reviews-request',
        page: 'commissioning-success',
        status: true,
        rollout: {}
      },
      {
        lastUpdatedOn: '2020-06-08',
        name: 'a-different-feature-flag',
        page: 'commissioning-success',
        status: true,
        rollout: {}
      }
    ]
    const result = getParsedFeatureFlags(featureFlags)

    expect(result).toEqual(parsedFeatureFlags)
  })
})

describe('useFeatureFlag', () => {
  it('should return false when requested flag is undefined', function() {
    jest.spyOn(reactRedux, 'useSelector').mockImplementation(() => jest.fn())
    const name = 'commissioning-success'
    const page = 'appstore-reviews-request'
    const result = useFeatureFlag({ name, page })

    expect(result).toEqual(false)
  })

  it('should return true when requested flag is defined and enabled', function() {
    const featureFlags = {
      featureFlags: {
        featureFlags: [
          {
            lastUpdatedOn: '2020-06-08',
            name: 'appstore-reviews-request',
            page: 'commissioning-success',
            status: true
          },
          {
            lastUpdatedOn: '2020-06-08',
            name: 'a-different-feature-flag',
            page: 'commissioning-success',
            status: true
          }
        ]
      }
    }

    jest
      .spyOn(reactRedux, 'useSelector')
      .mockImplementation(callback => callback(featureFlags))
    const name = 'appstore-reviews-request'
    const page = 'commissioning-success'
    const result = useFeatureFlag({ name, page })

    expect(result).toEqual(true)
  })

  it('should return true when requested flag is defined, enabled and rollout allowed (any)', function() {
    const featureFlags = {
      featureFlags: {
        featureFlags: [
          {
            lastUpdatedOn: '2020-06-08',
            name: 'appstore-reviews-request',
            page: 'commissioning-success',
            status: true,
            rollout: {
              criteria: 'any',
              dealerName: ['SunPower Global', 'Gabi Solar'],
              permissions: ['DEVICE_OVERVIEW_SEARCH', 'EDIT_CT_SCALING_FACTOR']
            }
          },
          {
            lastUpdatedOn: '2020-06-08',
            name: 'a-different-feature-flag',
            page: 'commissioning-success',
            status: true
          }
        ]
      },
      user: {
        data: {
          dealerName: 'SunPower Global'
        }
      }
    }

    jest
      .spyOn(reactRedux, 'useSelector')
      .mockImplementation(callback => callback(featureFlags))
    const name = 'appstore-reviews-request'
    const page = 'commissioning-success'
    const result = useFeatureFlag({ name, page })

    expect(result).toEqual(true)
  })

  it('should return false when requested flag is defined, enabled and rollout disallowed (any)', function() {
    const featureFlags = {
      featureFlags: {
        featureFlags: [
          {
            lastUpdatedOn: '2020-06-08',
            name: 'appstore-reviews-request',
            page: 'commissioning-success',
            status: true,
            rollout: {
              criteria: 'any',
              dealerName: ['Gabi Solar'],
              permissions: ['DEVICE_OVERVIEW_SEARCH', 'EDIT_CT_SCALING_FACTOR']
            }
          },
          {
            lastUpdatedOn: '2020-06-08',
            name: 'a-different-feature-flag',
            page: 'commissioning-success',
            status: true
          }
        ]
      },
      user: {
        data: {
          dealerName: 'SunPower Global',
          permissions: ['CREATE_SITE']
        }
      }
    }

    jest
      .spyOn(reactRedux, 'useSelector')
      .mockImplementation(callback => callback(featureFlags))
    const name = 'appstore-reviews-request'
    const page = 'commissioning-success'
    const result = useFeatureFlag({ name, page })

    expect(result).toEqual(false)
  })

  it('should return true when requested flag is defined, enabled and rollout allowed (all)', function() {
    const featureFlags = {
      featureFlags: {
        featureFlags: [
          {
            lastUpdatedOn: '2020-06-08',
            name: 'appstore-reviews-request',
            page: 'commissioning-success',
            status: true,
            rollout: {
              criteria: 'all',
              dealerName: ['SunPower Global', 'Gabi Solar'],
              permissions: ['DEVICE_OVERVIEW_SEARCH', 'EDIT_CT_SCALING_FACTOR']
            }
          },
          {
            lastUpdatedOn: '2020-06-08',
            name: 'a-different-feature-flag',
            page: 'commissioning-success',
            status: true
          }
        ]
      },
      user: {
        data: {
          dealerName: 'SunPower Global',
          permissions: ['EDIT_CT_SCALING_FACTOR']
        }
      }
    }

    jest
      .spyOn(reactRedux, 'useSelector')
      .mockImplementation(callback => callback(featureFlags))
    const name = 'appstore-reviews-request'
    const page = 'commissioning-success'
    const result = useFeatureFlag({ name, page })

    expect(result).toEqual(true)
  })

  it('should return false when requested flag is defined, enabled and rollout disallowed (all)', function() {
    const featureFlags = {
      featureFlags: {
        featureFlags: [
          {
            lastUpdatedOn: '2020-06-08',
            name: 'appstore-reviews-request',
            page: 'commissioning-success',
            status: true,
            rollout: {
              criteria: 'all',
              dealerName: ['SunPower Global', 'Gabi Solar'],
              permissions: ['DEVICE_OVERVIEW_SEARCH', 'EDIT_CT_SCALING_FACTOR']
            }
          },
          {
            lastUpdatedOn: '2020-06-08',
            name: 'a-different-feature-flag',
            page: 'commissioning-success',
            status: true
          }
        ]
      },
      user: {
        data: {
          dealerName: 'SunPower Global'
        }
      }
    }

    jest
      .spyOn(reactRedux, 'useSelector')
      .mockImplementation(callback => callback(featureFlags))
    const name = 'appstore-reviews-request'
    const page = 'commissioning-success'
    const result = useFeatureFlag({ name, page })

    expect(result).toEqual(false)
  })
})
