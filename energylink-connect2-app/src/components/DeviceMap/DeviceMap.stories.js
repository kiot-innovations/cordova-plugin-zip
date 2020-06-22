import React from 'react'
import { storiesOf } from '@storybook/react'

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

storiesOf('Device Map', module).add('Simple', () => (
  <div className="full-min-height pr-10 pl-10">
    <DeviceMap deviceList={deviceList} />
  </div>
))
