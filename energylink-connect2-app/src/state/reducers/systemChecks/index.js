import { find, prop, propEq, propOr } from 'ramda'
import { createReducer } from 'redux-act'

import {
  GET_SYSTEM_CHECKS_UPDATE,
  GET_SYSTEM_CHECKS_SUCCESS,
  RESET_SYSTEM_CHECKS,
  SYSTEM_CHECKS_INIT,
  GET_SYSTEM_CHECKS_ERROR
} from 'state/actions/systemChecks'

export const SYSTEM_CHECKS_STATUS = {
  NOT_RUNNING: 'NOT_RUNNING',
  RUNNING: 'RUNNING',
  SUCCEEDED: 'SUCCEEDED',
  FAILED: 'FAILED',
  UNSUPPORTED: 'UNSUPPORTED'
}

const CTNAME = {
  PRODUCTION: 'production-ct',
  CONSUMPTION: 'consumption-ct'
}

export const initialState = {
  productionCTProgress: 0,
  productionCTErrors: [],
  productionCTStatus: SYSTEM_CHECKS_STATUS.NOT_RUNNING,
  consumptionCTProgress: 0,
  consumptionCTErrors: [],
  consumptionCTStatus: SYSTEM_CHECKS_STATUS.NOT_RUNNING,
  overallStatus: SYSTEM_CHECKS_STATUS.NOT_RUNNING,
  overallErrors: []
}

const calculateStatus = (overallStatus, status) =>
  overallStatus === SYSTEM_CHECKS_STATUS.FAILED
    ? SYSTEM_CHECKS_STATUS.FAILED
    : status

const getProp = (
  checks = [],
  ctName = CTNAME.PRODUCTION,
  propName = 'status'
) =>
  propOr(
    SYSTEM_CHECKS_STATUS.NOT_RUNNING,
    propName,
    find(propEq('check_name', ctName), checks)
  )

export default createReducer(
  {
    [SYSTEM_CHECKS_INIT]: state => ({
      ...state,
      productionCTStatus: SYSTEM_CHECKS_STATUS.RUNNING,
      consumptionCTStatus: SYSTEM_CHECKS_STATUS.RUNNING,
      overallStatus: SYSTEM_CHECKS_STATUS.RUNNING,
      overallErrors: []
    }),
    [GET_SYSTEM_CHECKS_UPDATE]: (state, payload) => ({
      ...state,

      productionCTStatus: calculateStatus(
        prop('equinox_system_check_status', payload),
        getProp(payload.checks, CTNAME.PRODUCTION, 'status')
      ),

      consumptionCTStatus: calculateStatus(
        prop('equinox_system_check_status', payload),
        getProp(payload.checks, CTNAME.CONSUMPTION, 'status')
      ),

      productionCTProgress: getProp(
        payload.checks,
        CTNAME.PRODUCTION,
        'progress'
      ),

      consumptionCTProgress: getProp(
        payload.checks,
        CTNAME.CONSUMPTION,
        'progress'
      ),

      productionCTErrors: getProp(payload.checks, CTNAME.PRODUCTION, 'errors'),
      consumptionCTErrors: getProp(
        payload.checks,
        CTNAME.CONSUMPTION,
        'errors'
      ),

      overallStatus: SYSTEM_CHECKS_STATUS.RUNNING,
      overallErrors: propOr([], 'errors', payload)
    }),
    [GET_SYSTEM_CHECKS_SUCCESS]: (state, payload) => ({
      ...state,
      checks: payload.checks,
      productionCTStatus: calculateStatus(
        prop('equinox_system_check_status', payload),
        getProp(payload.checks, CTNAME.PRODUCTION, 'status')
      ),

      consumptionCTStatus: calculateStatus(
        prop('equinox_system_check_status', payload),
        getProp(payload.checks, CTNAME.CONSUMPTION, 'status')
      ),

      productionCTProgress: getProp(
        payload.checks,
        CTNAME.PRODUCTION,
        'progress'
      ),

      consumptionCTProgress: getProp(
        payload.checks,
        CTNAME.CONSUMPTION,
        'progress'
      ),

      productionCTErrors: getProp(payload.checks, CTNAME.PRODUCTION, 'errors'),
      consumptionCTErrors: getProp(
        payload.checks,
        CTNAME.CONSUMPTION,
        'errors'
      ),

      overallStatus: SYSTEM_CHECKS_STATUS.SUCCEEDED,
      overallErrors: propOr([], 'errors', payload)
    }),
    [GET_SYSTEM_CHECKS_ERROR]: state => ({
      ...state,
      overallStatus: SYSTEM_CHECKS_STATUS.FAILED
    }),
    [RESET_SYSTEM_CHECKS]: () => initialState
  },
  initialState
)
