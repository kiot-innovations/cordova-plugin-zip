import { createReducer } from 'redux-act'

import {
  SET_CONSUMPTION_CT,
  SET_PRODUCTION_CT,
  SET_RATED_CURRENT,
  RESET_SYSTEM_CONFIGURATION
} from 'state/actions/systemConfiguration'
import { RESET_COMMISSIONING } from 'state/actions/global'

const initialState = {
  consumptionCT: null,
  productionCT: null,
  ratedCurrent: 100
}

export const meterReducer = createReducer(
  {
    [SET_CONSUMPTION_CT]: (state, payload) => ({
      ...state,
      consumptionCT: payload
    }),
    [SET_PRODUCTION_CT]: (state, payload) => ({
      ...state,
      productionCT: payload
    }),
    [SET_RATED_CURRENT]: (state, payload) => ({
      ...state,
      ratedCurrent: payload
    }),
    [RESET_SYSTEM_CONFIGURATION]: () => initialState,
    [RESET_COMMISSIONING]: () => initialState
  },
  initialState
)
