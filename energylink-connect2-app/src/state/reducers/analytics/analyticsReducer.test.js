import {
  BEGIN_INSTALL,
  COMMISSION_SUCCESS,
  CONFIG_START
} from 'state/actions/analytics'
import { PUSH_CANDIDATES_INIT } from 'state/actions/devices'

import analyticsReducer, { initialState } from './index'

describe('The analytics reduces', () => {
  it('should have the correct actions', () => {
    expect(analyticsReducer.has(BEGIN_INSTALL)).toBe(true)
    expect(analyticsReducer.has(COMMISSION_SUCCESS)).toBe(true)
    expect(analyticsReducer.has(CONFIG_START)).toBe(true)
    expect(analyticsReducer.has(PUSH_CANDIDATES_INIT)).toBe(true)
  })

  it('should have the sime state in case a config start with no site change', () => {
    expect(analyticsReducer(undefined, {})).toEqual(initialState)
    expect(
      analyticsReducer(undefined, CONFIG_START({ siteChanged: false }))
    ).toEqual(initialState)
  })

  it('should have the sime state in case a config start with no site change', () => {
    const { configureTimer: initialConfigure, ...initialRest } = initialState

    const {
      configureTimer: reducedConfigure,
      ...reducedRest
    } = analyticsReducer(undefined, CONFIG_START({ siteChanged: true }))

    expect(initialRest).toEqual(reducedRest)
    expect(initialConfigure).not.toEqual(reducedConfigure)
  })
})
