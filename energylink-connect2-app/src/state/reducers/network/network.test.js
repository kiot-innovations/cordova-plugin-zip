import * as networkActions from '../../actions/network'

import { networkReducer } from './index'

describe('Network Reducer', () => {
  const reducerTest = reducerTester(networkReducer)

  it('returns the initial state', () => {
    reducerTest({}, {}, {})
  })

  it('populates the reducer state after PVS_CONNECTION_SUCCESS action is fired', () => {
    reducerTest(
      {
        connected: false,
        connecting: false,
        err: '',
        showEnablingAccessPoint: false
      },
      networkActions.PVS_CONNECTION_SUCCESS(),
      {
        connected: true,
        connecting: false,
        err: '',
        connectionCanceled: false,
        showEnablingAccessPoint: false
      }
    )
  })

  it('populates the reducer state after PVS_CONNECTION_SUCCESS_AFTER_REBOOT action is fired', () => {
    reducerTest(
      {
        connected: false,
        connecting: false,
        err: '',
        showEnablingAccessPoint: false
      },
      networkActions.PVS_CONNECTION_SUCCESS_AFTER_REBOOT(),
      {
        connected: true,
        connecting: false,
        err: '',
        connectionCanceled: false,
        showEnablingAccessPoint: false
      }
    )
  })
})
