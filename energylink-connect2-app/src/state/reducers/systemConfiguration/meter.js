import { createReducer } from 'redux-act'

import {
  SET_CONSUMPTION_CT,
  SET_PRODUCTION_CT,
  SET_RATED_CURRENT,
  RESET_SYSTEM_CONFIGURATION
} from 'state/actions/systemConfiguration'
import { RESET_COMMISSIONING } from 'state/actions/global'

export const METER = {
  NOT_USED: 'NOT_USED',
  GROSS_PRODUCTION_SITE: 'GROSS_PRODUCTION_SITE',
  NET_CONSUMPTION_LOADSIDE: 'NET_CONSUMPTION_LOADSIDE',
  GROSS_CONSUMPTION_LINESIDE: 'GROSS_CONSUMPTION_LINESIDE'
}

export const METER_ERRORS = {
  PRODUCTION_CT_NOT_SET: 'PRODUCTION_CT_NOT_SET',
  CONSUMPTION_CT_NOT_SET: 'CONSUMPTION_CT_NOT_SET'
}

const initialState = {
  consumptionCT: METER.NOT_USED,
  productionCT: METER.GROSS_PRODUCTION_SITE,
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
