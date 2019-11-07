import * as authActions from '../../actions/auth'
import * as userActions from '../../actions/user'
import { userReducer } from '.'

describe('User reducer', () => {
  const reducerTest = reducerTester(userReducer)

  it('returns the initial state', () => {
    reducerTest({}, {}, {})
  })

  it('empties the auth state when LOGIN_INIT action is fired', () => {
    reducerTest({ auth: { some: 'existing data' } }, authActions.LOGIN_INIT(), {
      auth: {},
      isAuthenticating: true
    })
  })

  it('populates the auth state when LOGIN_SUCCESS action is fired', () => {
    const userData = {
      addressId: 11781,
      expiresEpm: 1562765292686,
      isKiosk: false,
      tokenID: 'eed32654-57b0-4349-da71-a6993f3a7a92',
      userId: 262029
    }

    reducerTest(
      { more: 'other data', auth: 'existing data' },
      authActions.LOGIN_SUCCESS(userData),
      { more: 'other data', auth: userData, isAuthenticating: false }
    )
  })

  it('populates the auth state when LOGIN_ERROR actions is fired', () => {
    const userData = {
      err: {
        status: 401
      }
    }

    reducerTest(
      { more: 'other data', err: 'existing data' },
      authActions.LOGIN_ERROR(userData),
      { more: 'other data', err: userData, isAuthenticating: false }
    )
  })

  it('empties the data state when GET_USER_INIT action is fired', () => {
    reducerTest(
      { data: { some: 'existing data' } },
      userActions.GET_USER_INIT(),
      {
        data: {}
      }
    )
  })

  it('populates the data state when GET_USER_SUCCESS action is fired', () => {
    const userData = {
      AccountID: 20,
      AccountName: 'Demo Builder',
      AddressCreatedDateTime: '2010-09-29T16:40:17.050Z',
      AddressID: 11781,
      AddressName: '5 Douglas Court',
      Addresscount: 1
    }

    reducerTest(
      { more: 'other data', data: 'existing data' },
      userActions.GET_USER_SUCCESS(userData),
      { more: 'other data', data: userData }
    )
  })
})
