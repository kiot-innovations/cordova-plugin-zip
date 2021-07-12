import * as userActions from '../../actions/user'

import { userReducer } from '.'

describe('User reducer', () => {
  const reducerTest = reducerTester(userReducer)

  it('returns the initial state', () => {
    reducerTest({}, {}, {})
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
