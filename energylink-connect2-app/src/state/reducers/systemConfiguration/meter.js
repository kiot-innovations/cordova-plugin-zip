import { pathOr } from 'ramda'
import { createReducer } from 'redux-act'

import { DISCOVER_COMPLETE, UPDATE_DEVICES_LIST } from 'state/actions/devices'
import { RESET_COMMISSIONING } from 'state/actions/global'
import {
  SET_CONSUMPTION_CT,
  SET_PRODUCTION_CT,
  SET_RATED_CURRENT,
  RESET_SYSTEM_CONFIGURATION,
  SUBMIT_COMMISSION_SUCCESS
} from 'state/actions/systemConfiguration'

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
  ratedCurrent: 100,
  previousConfigsForPVS: {}
}

export const meterReducer = createReducer(
  {
    [UPDATE_DEVICES_LIST]: (state, payload) => ({
      ...state,
      productionCT: pathOr(state.productionCT, [1, 'subtype'], payload),
      consumptionCT: pathOr(state.consumptionCT, [2, 'subtype'], payload)
    }),
    [DISCOVER_COMPLETE]: (state, payload) => ({
      ...state,
      productionCT: pathOr(
        state.productionCT,
        ['devices', 'devices', 1, 'subtype'],
        payload
      ),
      consumptionCT: pathOr(
        state.consumptionCT,
        ['devices', 'devices', 2, 'subtype'],
        payload
      )
    }),
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
    [SUBMIT_COMMISSION_SUCCESS]: (state, { serialNumber }) => {
      const { consumptionCT, ratedCurrent, previousConfigsForPVS } = state
      if (serialNumber) {
        previousConfigsForPVS[serialNumber] = { consumptionCT, ratedCurrent }
      }
      return {
        ...state,
        previousConfigsForPVS
      }
    },
    [RESET_SYSTEM_CONFIGURATION]: () => initialState,
    [RESET_COMMISSIONING]: () => initialState
  },
  initialState
)
