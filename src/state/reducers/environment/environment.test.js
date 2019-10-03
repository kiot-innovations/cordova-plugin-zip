import * as environmentActions from '../../actions/environment'
import { environmentReducer } from '.'

const initialState = {
  lteValue: 0,
  envImpact: {
    carbondioxide: {
      value: 0,
      units: 'ENV_SAVINGS_POUNDS'
    },
    carmiles: 0,
    gasoline: 0,
    coal: 0,
    crudeoil: 0,
    trees: 0,
    garbage: 0
  },
  isGettingLTEData: false,
  isComputingSavings: false
}

describe('Environment reducer', () => {
  const reducerTest = reducerTester(environmentReducer)

  it('returns the initial state', () => {
    reducerTest(initialState, {}, initialState)
  })

  it('set true the isGettingLTEData flag when FETCH_LTE_DATA_INIT action is fired', () => {
    reducerTest(initialState, environmentActions.FETCH_LTE_DATA_INIT(), {
      ...initialState,
      isGettingLTEData: true
    })
  })

  it('set flase the isGettingLTEData flag & set LTE value when FETCH_LTE_DATA_SUCCESS action is fired', () => {
    reducerTest(initialState, environmentActions.FETCH_LTE_DATA_SUCCESS(100), {
      ...initialState,
      lteValue: 100
    })
  })

  it('return to initial state when FETCH_LTE_DATA_ERROR action is fired', () => {
    reducerTest(
      { ...initialState, lteValue: 15000 },
      environmentActions.FETCH_LTE_DATA_ERROR(),
      initialState
    )
  })

  it('set true the isComputingSavings flag when COMPUTE_SAVINGS_INIT action is fired', () => {
    reducerTest(initialState, environmentActions.COMPUTE_SAVINGS_INIT(), {
      ...initialState,
      isComputingSavings: true
    })
  })

  it('set flase the isComputingSavings flag & set compute savings when FETCH_LTE_DATA_SUCCESS action is fired', () => {
    reducerTest(
      initialState,
      environmentActions.COMPUTE_SAVINGS_SUCCESS({ value: 100 }),
      {
        ...initialState,
        envImpact: { value: 100 }
      }
    )
  })
})
