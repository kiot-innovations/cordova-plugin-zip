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
        showManualInstructions: false
      },
      networkActions.PVS_CONNECTION_SUCCESS(),
      {
        connected: true,
        connecting: false,
        err: '',
        connectionCanceled: false,
        showManualInstructions: false
      }
    )
  })
})
