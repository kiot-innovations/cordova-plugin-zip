import * as networkActions from '../../actions/network'

import { networkReducer } from './index'

describe('Network Reducer', () => {
  const reducerTest = reducerTester(networkReducer)

  it('returns the initial state', () => {
    reducerTest({}, {}, {})
  })

  it('populates the reducer state after PVS_CONNECTION_SUCCESS action is fired', () => {
    reducerTest(
      { connected: false, connecting: false, SSID: '', err: '' },
      networkActions.PVS_CONNECTION_SUCCESS('Sunpower12345'),
      { connected: true, connecting: false, SSID: 'Sunpower12345', err: '' }
    )
  })
})
