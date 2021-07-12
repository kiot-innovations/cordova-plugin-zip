import { shallow } from 'enzyme'
import { clone } from 'ramda'
import React from 'react'

import DiscoveryStatus from './DiscoveryStatus'

import * as i18n from 'shared/i18n'

const okMI = [
  {
    serial_number: 'E00110223232323',
    indicator: 'MI_OK',
    STATEDESCR: 'OK',
    SERIAL: 'E00110223232323'
  },
  {
    serial_number: 'E00110223232324',
    indicator: 'MI_OK',
    STATEDESCR: 'OK',
    SERIAL: 'E00110223232324'
  }
]

const props = {
  error: null,
  expected: 2,
  okMICount: okMI.length,
  errMICount: 0,
  claimError: 0,
  claimingDevices: false,
  claimDevices: jest.fn(),
  claimProgress: 0,
  discoveryComplete: true,
  retryDiscovery: jest.fn()
}

describe('DiscoveryStatus page', () => {
  let mprops

  beforeEach(() => {
    jest.spyOn(i18n, 'useI18n').mockImplementation(() => key => key)
    mprops = clone(props)
  })

  test('Renders correctly when discovering', () => {
    mprops.discoveryComplete = false
    const component = shallow(<DiscoveryStatus {...mprops} />)
    expect(component).toMatchSnapshot()
  })

  test('Renders correctly when ended discovering', () => {
    const component = shallow(<DiscoveryStatus {...mprops} />)
    expect(component).toMatchSnapshot()
  })

  test('Renders correctly when discovery complete and has errors', () => {
    mprops.error = 'BAD_REQUEST_OFFLINE'
    const component = shallow(<DiscoveryStatus {...mprops} />)
    expect(component).toMatchSnapshot()
  })

  test('Renders correctly when claiming devices', () => {
    mprops.claimingDevices = true
    mprops.claimProgress = 20
    const component = shallow(<DiscoveryStatus {...mprops} />)
    expect(component).toMatchSnapshot()
  })

  test('The claiming progress is shown on the button and it is disabled', () => {
    mprops.claimingDevices = true
    mprops.claimProgress = 20
    const component = shallow(<DiscoveryStatus {...mprops} />)

    const btn = component.find('button:not(.is-outlined)')
    expect(btn.text()).toBe('20%')
    expect(btn.prop('disabled')).toBe(true)
  })

  test('When discovering, no buttons are shown but only the message', () => {
    mprops.discoveryComplete = false
    mprops.error = 'DISCOVER_ERROR'
    const component = shallow(<DiscoveryStatus {...mprops} />)

    const btn = component.find('button:not(.is-outlined)')
    const txt = component.find('span')
    expect(btn.exists()).toBe(false)
    expect(txt.text()).toBe('DISCOVERY_IN_PROGRESS')
  })

  test('When discovering, a retry button is shown in case of error', () => {
    mprops.error = 'DISCOVER_ERROR'
    const component = shallow(<DiscoveryStatus {...mprops} />)

    const btn = component.find('button.ml-10')
    expect(btn.exists()).toBe(true)
    expect(btn.text()).toBe('RETRY')
    btn.simulate('click')
    expect(mprops.retryDiscovery).toHaveBeenCalled()
  })
})
