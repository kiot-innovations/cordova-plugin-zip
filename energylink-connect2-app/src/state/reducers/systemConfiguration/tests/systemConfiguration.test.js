import {
  submitConfigReducer,
  initialState,
  preconfigStates
} from '../submitConfiguration'

import { RESET_COMMISSIONING } from 'state/actions/global'
import {
  SUBMIT_CLEAR,
  REPLACE_RMA_PVS,
  SUBMIT_CONFIG,
  SUBMIT_CONFIG_SUCCESS,
  SUBMIT_CONFIG_ERROR,
  SUBMIT_COMMISSION_SUCCESS,
  SUBMIT_COMMISSION_ERROR,
  RESET_SYSTEM_CONFIGURATION,
  ALLOW_COMMISSIONING,
  SUBMIT_PRECONFIG_GRIDPROFILE,
  SUBMIT_PRECONFIG_ERROR,
  SUBMIT_PRECONFIG_SUCCESS
} from 'state/actions/systemConfiguration'

describe('[Reducer] System Configuration', function() {
  it('should have the correct actions', function() {
    expect(submitConfigReducer.has(SUBMIT_CLEAR)).toBe(true)
    expect(submitConfigReducer.has(REPLACE_RMA_PVS)).toBe(true)
    expect(submitConfigReducer.has(SUBMIT_CONFIG)).toBe(true)
    expect(submitConfigReducer.has(SUBMIT_CONFIG_SUCCESS)).toBe(true)
    expect(submitConfigReducer.has(SUBMIT_CONFIG_ERROR)).toBe(true)
    expect(submitConfigReducer.has(SUBMIT_COMMISSION_SUCCESS)).toBe(true)
    expect(submitConfigReducer.has(SUBMIT_COMMISSION_ERROR)).toBe(true)
    expect(submitConfigReducer.has(RESET_SYSTEM_CONFIGURATION)).toBe(true)
    expect(submitConfigReducer.has(ALLOW_COMMISSIONING)).toBe(true)
    expect(submitConfigReducer.has(SUBMIT_PRECONFIG_GRIDPROFILE)).toBe(true)
    expect(submitConfigReducer.has(SUBMIT_PRECONFIG_ERROR)).toBe(true)
    expect(submitConfigReducer.has(SUBMIT_PRECONFIG_SUCCESS)).toBe(true)
    expect(submitConfigReducer.has(RESET_COMMISSIONING)).toBe(true)
  })

  it('should not change the initial state', function() {
    expect(initialState).toMatchSnapshot()
  })

  it('should not change the state if no action is passed', function() {
    expect(submitConfigReducer(undefined, {})).toEqual(initialState)
  })

  it('should set submitting to true and config to a valid config object on SUBMIT_CONFIG', function() {
    const { submitting, config, ...initialRest } = initialState
    const configPayload = {
      site: 'a'
    }
    const {
      submitting: submittingReduced,
      config: configReduced,
      ...reducedRest
    } = submitConfigReducer(undefined, SUBMIT_CONFIG(configPayload))
    expect(submittingReduced).toBe(true)
    expect(configReduced).toStrictEqual(configPayload)
    expect(initialRest).toStrictEqual(reducedRest)
    expect(submitting).not.toEqual(submittingReduced)
    expect(config).not.toEqual(configReduced)
  })

  it('should set preconfigState to STARTED as soon as we submit grid profile', function() {
    const { preconfigState, ...initialRest } = initialState
    const payload = {
      gridProfile: {}
    }
    const {
      preconfigState: preconfigStateReduced,
      ...reducedRest
    } = submitConfigReducer(undefined, SUBMIT_PRECONFIG_GRIDPROFILE(payload))

    expect(preconfigStateReduced).toBe(preconfigStates.STARTED)
    expect(initialRest).toStrictEqual(reducedRest)
  })

  it('should set preconfigState to ERROR and set a message in preconfigError if SUBMIT_PRECONFIG_ERROR is dispatched', function() {
    const { preconfigState, preconfigError, ...initialRest } = initialState
    const errorMessage = 'Something has failed'
    const {
      preconfigState: preconfigStateReduced,
      preconfigError: preconfigErrorReduced,
      ...reducedRest
    } = submitConfigReducer(undefined, SUBMIT_PRECONFIG_ERROR(errorMessage))

    expect(preconfigStateReduced).toBe(preconfigStates.ERROR)
    expect(preconfigErrorReduced).toBe(errorMessage)
    expect(initialRest).toStrictEqual(reducedRest)
  })

  it('should set preconfigState to SUCCESS and clear error message if SUBMIT_PRECONFIG_SUCCESS is dispatched', function() {
    const { preconfigState, preconfigError, ...initialRest } = initialState
    const {
      preconfigState: preconfigStateReduced,
      preconfigError: preconfigErrorReduced,
      ...reducedRest
    } = submitConfigReducer(undefined, SUBMIT_PRECONFIG_SUCCESS({}))

    expect(preconfigStateReduced).toBe(preconfigStates.SUCCESS)
    expect(preconfigErrorReduced).toBe(preconfigError)
    expect(initialRest).toStrictEqual(reducedRest)
  })
})
