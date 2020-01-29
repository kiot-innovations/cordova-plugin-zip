import * as systemConfigurationReducers from '../../actions/systemConfiguration'
import { networkReducer } from './network'
describe('Site Reducer', () => {
  const reducerTest = reducerTester(networkReducer)

  it('returns the initial state', () => {
    reducerTest({}, {}, {})
  })

  it('populates the reducer state after GET_NETWORK_APS_INIT action is fired', () => {
    reducerTest(
      { isFetching: false },
      systemConfigurationReducers.GET_NETWORK_APS_INIT(),
      {
        isFetching: true
      }
    )
  })

  it('populates the reducer state after GET_NETWORK_APS_SUCCESS action is fired', () => {
    reducerTest(
      { isFetching: false },
      systemConfigurationReducers.GET_NETWORK_APS_SUCCESS([{ ssid: '1' }]),
      {
        isFetching: false,
        aps: [{ ssid: '1' }]
      }
    )
  })

  it('populates the reducer state after CONNECT_NETWORK_AP_SUCCESS action is fired', () => {
    reducerTest(
      { isFetching: false },
      systemConfigurationReducers.CONNECT_NETWORK_AP_SUCCESS({ ssid: '1' }),
      {
        isFetching: false,
        selectedAP: { ssid: '1' },
        isConnected: true
      }
    )
  })
})
