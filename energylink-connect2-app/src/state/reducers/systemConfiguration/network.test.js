import * as systemConfigurationReducers from '../../actions/systemConfiguration'
import { networkReducer } from './network'
describe('SC Network Reducer', () => {
  const reducerTest = reducerTester(networkReducer)

  it('returns the initial state', () => {
    reducerTest({}, {}, {})
  })

  it('populates the reducer state after GET_NETWORK_APS_INIT action is fired', () => {
    reducerTest(
      { isFetching: false },
      systemConfigurationReducers.GET_NETWORK_APS_INIT(),
      {
        isFetching: true,
        error: null
      }
    )
  })

  it('populates the reducer state after GET_NETWORK_APS_SUCCESS action is fired', () => {
    reducerTest(
      { isFetching: false },
      systemConfigurationReducers.GET_NETWORK_APS_SUCCESS([{ ssid: '1' }]),
      {
        isFetching: false,
        aps: [{ ssid: '1' }],
        error: null
      }
    )
  })
})
