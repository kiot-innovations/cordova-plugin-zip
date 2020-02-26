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
        data: {},
        error: null
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
        data: { powerProduction: 'On', result: 'Pass', progress: 100 }
      }
    )
  })
})
