import { SUBMIT_COMMISSION_SUCCESS } from 'state/actions/systemConfiguration'

import {
  MIXPANEL_EVENT_QUEUED,
  COMMISSION_SUCCESS
} from 'state/actions/analytics'

describe('The configure epics file', () => {
  const mixpanelMock = {
    track: jest.fn(),
    unregister: jest.fn()
  }
  beforeEach(() => {
    jest.resetModules()
    window.mixpanel = mixpanelMock
    mixpanelMock.track.mockReset()
    mixpanelMock.unregister.mockReset()
  })

  it('should register to mixpanel the correct timestamp', () => {
    const epicTest = epicTester(
      require('../configureEpics').submitCommissionSuccess
    )
    const inputValues = 'a'
    const inputMarble = {
      a: SUBMIT_COMMISSION_SUCCESS()
    }
    const outputMarble = {
      a: MIXPANEL_EVENT_QUEUED(
        'Commission Site - first successful site configuration'
      ),
      b: COMMISSION_SUCCESS()
    }
    epicTest(inputValues, '(ab)', inputMarble, outputMarble, {
      analytics: {}
    })
  })
  it('should return nothing if site is already commissioned', () => {
    const epicTest = epicTester(
      require('../configureEpics').submitCommissionSuccess
    )

    const inputMarble = {
      a: SUBMIT_COMMISSION_SUCCESS()
    }

    const outputMarble = {}

    epicTest('a', '', inputMarble, outputMarble, {
      analytics: { commissioningSuccess: true }
    })
  })
})
