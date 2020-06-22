import React from 'react'
import { shallow } from 'enzyme'
import DeviceMap from '.'

const deviceList = [
  {
    serial_number: '048572340857NND',
    last_mapped: '2020-02-15 01:23:45',
    device_type: 'All in one',
    device_fw_ver: '1.2.3'
  },
  {
    serial_number: '048572340857NND',
    last_mapped: '2020-02-15 01:23:45',
    device_type: 'Inverter',
    device_fw_ver: '1.2.3'
  },
  {
    serial_number: '048572340857NND',
    last_mapped: '2020-02-15 01:23:45',
    device_type: 'MIDC',
    device_fw_ver: '1.2.3'
  },
  {
    serial_number: '048572340857NND',
    last_mapped: '2020-02-15 01:23:45',
    device_type: 'Battery',
    device_fw_ver: '1.2.3'
  }
]

describe('Device Map Component', () => {
  test('Renders Correctly', () => {
    const component = shallow(<DeviceMap deviceList={deviceList} />)
    expect(component).toMatchSnapshot()
  })
})
