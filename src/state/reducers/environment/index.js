import { createReducer } from 'redux-act'
import {
  COMPUTE_SAVINGS_INIT,
  COMPUTE_SAVINGS_SUCCESS,
  FETCH_LTE_DATA_ERROR,
  FETCH_LTE_DATA_INIT,
  FETCH_LTE_DATA_SUCCESS
} from '../../actions/environment'
import { LOGOUT } from '../../actions/auth'

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

export const environmentReducer = createReducer(
  {
    [FETCH_LTE_DATA_INIT]: state => ({
      ...state,
      isGettingLTEData: true
    }),
    [FETCH_LTE_DATA_SUCCESS]: (state, payload) => ({
      ...state,
      isGettingLTEData: false,
      lteValue: payload
    }),
    [FETCH_LTE_DATA_ERROR]: () => initialState,
    [COMPUTE_SAVINGS_INIT]: state => ({
      ...state,
      isComputingSavings: true
    }),
    [COMPUTE_SAVINGS_SUCCESS]: (state, payload) => ({
      ...state,
      isComputingSavings: false,
      envImpact: payload
    }),
    [LOGOUT]: () => initialState
  },
  initialState
)
