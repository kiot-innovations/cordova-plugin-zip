import analyticsReducer, { initialState } from './index'

import {
  BEGIN_INSTALL,
  COMMISSION_SUCCESS,
  CONFIG_START
} from 'state/actions/analytics'
import { CLAIM_DEVICES_INIT } from 'state/actions/devices'

describe('The analytics reducer', () => {
  it('should have the correct actions', () => {
    expect(analyticsReducer.has(BEGIN_INSTALL)).toBe(true)
    expect(analyticsReducer.has(COMMISSION_SUCCESS)).toBe(true)
    expect(analyticsReducer.has(CONFIG_START)).toBe(true)
    expect(analyticsReducer.has(CLAIM_DEVICES_INIT)).toBe(true)
  })

  it('should have the same state in case a config start with no siteKey change', () => {
    const { configureTimer: initialConfigure, ...initialRest } = initialState

    const {
      configureTimer: reducedConfigure,
      ...reducedRest
    } = analyticsReducer(undefined, CONFIG_START({ siteKey: 'A_123456' }))

    expect(initialRest).toEqual(reducedRest)
    expect(initialConfigure).not.toEqual(reducedConfigure)
  })
})
