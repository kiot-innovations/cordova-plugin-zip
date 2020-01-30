import * as systemConfigurationReducers from '../../actions/systemConfiguration'
import { meterReducer } from './meter'
describe('SC Meter Reducer', () => {
  const reducerTest = reducerTester(meterReducer)

  it('returns the initial state', () => {
    reducerTest({}, {}, {})
  })

  it('populates the reducer state after SET_COMSUMPTION_CT action is fired', () => {
    reducerTest(
      { consumptionCT: 0 },
      systemConfigurationReducers.SET_CONSUMPTION_CT(1),
      {
        consumptionCT: 1
      }
    )
  })

  it('populates the reducer state after SET_PRODUCTION_CT action is fired', () => {
    reducerTest(
      { productionCT: 0 },
      systemConfigurationReducers.SET_PRODUCTION_CT(1),
      {
        productionCT: 1
      }
    )
  })

  it('populates the reducer state after SET_RATED_CURRENT action is fired', () => {
    reducerTest(
      { ratedCurrent: 100 },
      systemConfigurationReducers.SET_RATED_CURRENT(101),
      {
        ratedCurrent: 101
      }
    )
  })
})
