import React from 'react'
import { storiesOf } from '@storybook/react'
import StorageDevices from './StorageDevices'

const data = {
  pre_discovery_report: {
    devices: [
      {
        serial_number: '048572340857NND',
        device_type: 'MIDC',
        device_fw_ver: '1.2.3'
      },
      {
        serial_number: '048572340857NND',
        device_type: 'Storage Inverter',
        device_fw_ver: '1.2.3'
      },
      {
        serial_number: '048572340857NND',
        device_type: 'Multi I/O Board',
        device_fw_ver: '1.2.3'
      },
      {
        serial_number: '048572340857NND',
        device_type: 'Battery',
        device_fw_ver: '1.2.3'
      },
      {
        serial_number: '048572340857NND',
        device_type: 'Battery',
        device_fw_ver: '1.2.3'
      }
    ]
  },
  errors: [
    {
      error_name: 'UNDER_VOLT_ALARM',
      last_occurrence: '2020-02-15 01:23:45',
      error_code: '4.5.1',
      device_sn: '048572340857NND',
      error_message: 'Critical: low battery SOH.',
      value: {
        value: 0,
        unit: 'string'
      }
    }
  ]
}
storiesOf('Storage - Prediscovery', module).add('With Data', () => (
  <div className="full-min-height">
    <StorageDevices devices={data} />
  </div>
))
