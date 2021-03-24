import * as systemConfigurationReducers from '../../actions/systemConfiguration'
import rseReducer from './rse'
describe('RSE Reducer', () => {
  const reducerTest = reducerTester(rseReducer)

  it('returns the initial state', () => {
    reducerTest({}, {}, {})
  })

  it('populates the reducer state after GET_RSE_INIT action is fired', () => {
    reducerTest(
      {
        isSetting: false,
        data: {},
        error: null,
        newRSEValue: null,
        isPolling: false
      },
      systemConfigurationReducers.GET_RSE_INIT(true),
      {
        data: {
          progress: null
        },
        error: null,
        newRSEValue: null,
        isSetting: false,
        isPolling: true,
        updated: false
      }
    )
  })

  it('populates the reducer state after GET_RSE_SUCCESS action is fired', () => {
    reducerTest(
      { data: {}, isSetting: false, selectedPowerProduction: null },
      systemConfigurationReducers.GET_RSE_SUCCESS({
        powerProduction: 'On',
        result: 'Pass',
        progress: 100
      }),
      {
        data: { powerProduction: 'On', result: 'Pass', progress: 100 },
        selectedPowerProduction: 'On',
        updated: false
      }
    )
  })
})
