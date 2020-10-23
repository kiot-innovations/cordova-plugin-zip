import { LOGIN_SUCCESS } from 'state/actions/auth'
import { SET_DEALER_NAME } from 'state/actions/user'
import * as analytics from 'shared/analytics'
import { MIXPANEL_EVENT_QUEUED } from 'state/actions/analytics'
import * as utils from './epicUtils'
import { of } from 'rxjs'

describe('The loginSuccessEpic', function() {
  let epicTest
  beforeEach(function() {
    epicTest = undefined
  })
  it('should dispatch MIXPANEL_EVENT_QUEUED if we could get the party ID', () => {
    const getParty = jest.fn(() =>
      of({
        status: 200,
        body: { parentDisplayName: 'My awesome Dealer' }
      })
    )
    utils.getPartyPromise = getParty
    const loggedIn = jest.fn(() => MIXPANEL_EVENT_QUEUED('Login - Success'))
    analytics.loggedIn = loggedIn

    epicTest = epicTester(require('./loginEpics').loginSuccessEpic)
    const userData = {
      name: 'john Doe',
      partyId: '123'
    }
    const inputValues = {
      l: LOGIN_SUCCESS({
        data: userData,
        auth: { access_token: 123456 }
      })
    }
    const expectedValue = {
      m: MIXPANEL_EVENT_QUEUED('Login - Success'),
      u: SET_DEALER_NAME('My awesome Dealer')
    }
    const inputMarble = 'l'
    const expectedMarble = '(mu)'

    epicTest(inputMarble, expectedMarble, inputValues, expectedValue)
    expect(loggedIn).toBeCalledTimes(1)
    expect(loggedIn).toBeCalledWith({
      dealerName: 'My awesome Dealer',
      name: 'john Doe',
      partyId: '123'
    })
    expect(getParty).toBeCalledWith(123456, '123')
    expect(getParty).toBeCalledTimes(1)
  })

  it('should dispatch MIXPANEL_EVENT_QUEUED if we could NOT get the party ID', function() {
    const getParty = jest.fn(() =>
      of({
        status: 203,
        body: {}
      })
    )
    utils.getPartyPromise = getParty
    const loggedIn = jest.fn(() => MIXPANEL_EVENT_QUEUED('Login - Success'))
    analytics.loggedIn = loggedIn

    epicTest = epicTester(require('./loginEpics').loginSuccessEpic)
    const userData = {
      name: 'john Doe',
      partyId: '123'
    }
    const inputValues = {
      l: LOGIN_SUCCESS({
        data: userData,
        auth: { access_token: 123456 }
      })
    }
    const expectedValue = {
      m: MIXPANEL_EVENT_QUEUED('Login - Success')
    }
    const inputMarble = '(l)'
    const expectedMarble = '(m)'

    epicTest(inputMarble, expectedMarble, inputValues, expectedValue)
    expect(loggedIn).toBeCalledTimes(1)
    expect(loggedIn).toBeCalledWith({
      name: 'john Doe',
      partyId: '123'
    })
    expect(getParty).toBeCalledWith(123456, '123')
    expect(getParty).toBeCalledTimes(1)
  })
})
