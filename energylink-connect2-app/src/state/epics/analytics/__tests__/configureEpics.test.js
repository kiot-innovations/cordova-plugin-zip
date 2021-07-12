import {
  MIXPANEL_EVENT_QUEUED,
  COMMISSION_SUCCESS
} from 'state/actions/analytics'
import { SUBMIT_COMMISSION_SUCCESS } from 'state/actions/systemConfiguration'

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

  test.skip('should register to mixpanel the correct timestamp', () => {
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
describe('The configureEpics utils', function() {
  describe('The getConsumptionMeterType function', function() {
    const getConsumptionMeterType = require('../configureEpics')
      .getConsumptionMeterType
    it('should get the meter type correctly', function() {
      const consumptionCT = 'ACTIVE'
      const state = { systemConfiguration: { meter: { consumptionCT } } }
      expect(getConsumptionMeterType(state)).toBe(consumptionCT)
    })
    it("should return N/A in case it doesn't work", function() {
      expect(getConsumptionMeterType({})).toBe('N/A')
    })
  })
  describe('The getGridProfile function', function() {
    const getGridProfile = require('../configureEpics').getGridProfile
    it('should get the correct grid profile in the state ', function() {
      const name = 'IEEE-1547a-2014 + 2020 CA Rule21'
      const tempState = {
        systemConfiguration: {
          gridBehavior: {
            selectedOptions: {
              profile: {
                name
              }
            }
          }
        }
      }
      expect(getGridProfile(tempState)).toBe(name)
    })
    it('should get N/A in case there is no grid profile', function() {
      expect(getGridProfile({})).toBe('N/A')
    })
  })
})
