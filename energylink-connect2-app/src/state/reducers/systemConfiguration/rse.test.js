import * as systemConfigurationReducers from '../../actions/systemConfiguration'
import rseReducer from './rse'
describe('RSE Reducer', () => {
  const reducerTest = reducerTester(rseReducer)

  it('returns the initial state', () => {
    reducerTest({}, {}, {})
  })

  it('populates the reducer state after GET_RSE_INIT action is fired', () => {
    reducerTest(
      { isFetching: false },
      systemConfigurationReducers.GET_RSE_INIT(),
      {
        isFetching: true,
        isSetting: false,
        data: {},
        error: null,
        newRSEValue: null,
        isPolling: false,
        pollProgress: 0
      }
    )
  })

  it('populates the reducer state after GET_RSE_SUCCESS action is fired', () => {
    reducerTest(
      { isFetching: false },
      systemConfigurationReducers.GET_RSE_SUCCESS({
        powerProduction: 'On',
        result: 'Pass',
        progress: 100
      }),
      {
        isFetching: false,
        pollProgress: 0,
        data: { powerProduction: 'On', result: 'Pass', progress: 100 }
      }
    )
  })
})
