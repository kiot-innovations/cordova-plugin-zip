import { createReducer } from 'redux-act'

import {
  SET_CONSUMPTION_CT,
  SET_PRODUCTION_CT,
  SET_RATED_CURRENT
} from 'state/actions/systemConfiguration'

const initialState = {
  consumptionCT: 0,
  productionCT: 0,
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
    })
  },
  initialState
)