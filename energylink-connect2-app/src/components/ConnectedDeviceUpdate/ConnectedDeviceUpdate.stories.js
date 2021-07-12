import { storiesOf } from '@storybook/react'
import React from 'react'

import ConnectedDeviceUpdate from '.'

const data0 = {
  serial_number: 'ZT123456789',
  fw_ver_from: '1.2.3',
  fw_ver_to: '1.2.4',
  progress: 0,
  device_type: 'Storage Inverter'
}

const data50 = {
  serial_number: 'ZT123456789',
  fw_ver_from: '1.2.3',
  fw_ver_to: '1.2.4',
  progress: 50,
  device_type: 'Storage Inverter'
}

const data100 = {
  serial_number: 'ZT123456789',
  fw_ver_from: '1.2.3',
  fw_ver_to: '1.2.4',
  progress: 100,
  device_type: 'Storage Inverter'
}

const dataError = {
  serial_number: 'ZT123456789',
  fw_ver_from: '1.2.3',
  fw_ver_to: '1.2.4',
  progress: 50,
  device_type: 'Storage Inverter',
  error: true
}

storiesOf('Storage - Connected Device Update', module)
  .add('Update Pending', () => (
    <div className="full-min-height pl-10 pr-10">
      <ConnectedDeviceUpdate device={data0} />
    </div>
  ))
  .add('Update in progress', () => (
    <div className="full-min-height pl-10 pr-10">
      <ConnectedDeviceUpdate device={data50} />
    </div>
  ))
  .add('Update completed', () => (
    <div className="full-min-height pl-10 pr-10">
      <ConnectedDeviceUpdate device={data100} />
    </div>
  ))
  .add('Error in update', () => (
    <div className="full-min-height pl-10 pr-10">
      <ConnectedDeviceUpdate device={dataError} />
    </div>
  ))
