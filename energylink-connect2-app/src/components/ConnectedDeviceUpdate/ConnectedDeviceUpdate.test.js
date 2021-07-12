import { shallow } from 'enzyme'
import React from 'react'

import ConnectedDeviceUpdate from './index'

import * as i18n from 'shared/i18n'

describe('Connected Device Update Component', () => {
  beforeEach(() => {
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  test('Renders Correctly', () => {
    const data = {
      serial_number: 'ZT123456789',
      fw_ver_from: '1.2.3',
      fw_ver_to: '1.2.4',
      progress: 0,
      device_type: 'Storage Inverter'
    }

    const component = shallow(<ConnectedDeviceUpdate device={data} />)
    expect(component).toMatchSnapshot()
    expect(component.find('.sp-hey').exists()).toBe(false)
  })

  test('Renders Correctly when error', () => {
    const data = {
      serial_number: 'ZT123456789',
      fw_ver_from: '1.2.3',
      fw_ver_to: '1.2.4',
      progress: 0,
      device_type: 'Storage Inverter',
      error: true
    }

    const component = shallow(<ConnectedDeviceUpdate device={data} />)
    expect(component).toMatchSnapshot()
    expect(component.find('.sp-hey').exists()).toBe(true)
  })
})
