import * as systemConfigurationReducers from '../../actions/systemConfiguration'
import { networkReducer } from './network'
describe('SC Network Reducer', () => {
  const reducerTest = reducerTester(networkReducer)

  it('returns the initial state', () => {
    reducerTest({}, {}, {})
  })

  it('populates the reducer state after GET_NETWORK_APS_INIT action is fired', () => {
    reducerTest(
      {
        isFetching: false,
        isConnecting: false,
        errorFetching: null,
        errorConnecting: null
      },
      systemConfigurationReducers.GET_NETWORK_APS_INIT(),
      {
        isFetching: true,
        isConnecting: false,
        errorFetching: null,
        errorConnecting: null
      }
    )
  })

  it('populates the reducer state after GET_NETWORK_APS_SUCCESS action is fired', () => {
    reducerTest(
      {
        isFetching: false,
        isConnecting: false,
        errorFetching: null,
        errorConnecting: null
      },
      systemConfigurationReducers.GET_NETWORK_APS_SUCCESS([{ ssid: '1' }]),
      {
        isConnecting: false,
        isFetching: false,
        aps: [{ ssid: '1' }],
        errorFetching: null,
        errorConnecting: null
      }
    )
  })
})
