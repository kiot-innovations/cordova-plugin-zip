import React from 'react'
import { storiesOf } from '@storybook/react'
import ESSHealthCheck from '.'

const results = {
  ess_report: {
    ess_status: [
      { ess_sn: 'ess_sn', mio_sn: 'mio_sn' },
      { ess_sn: 'ess_sn', mio_sn: 'mio_sn' }
    ],
    last_updated: '2020-02-15 01:23:45',
    inverter_status: [
      { serial_number: 'serial_number' },
      { serial_number: 'serial_number' }
    ],
    hub_plus_status: {
      contactor_error: '0',
      hub_plus_sn: 'hub_plus_sn',
      contactor_position: '0',
      grid_voltage_state: 'METER_VOLTAGE_IN_RANGE',
      load_voltage_state: 'METER_VOLTAGE_IN_RANGE',
      grid_frequency_state: 'METER_FREQ_IN_RANGE',
      midc_sn: 'midc_sn',
      load_frequency_state: 'METER_FREQ_IN_RANGE'
    },
    battery_status: [
      {
        serial_number: 'serial_number',
        available_energy: { unit: 'unit', value: 0.8008281904610115 }
      },
      {
        serial_number: 'serial_number',
        available_energy: { unit: 'unit', value: 0.8008281904610115 }
      }
    ]
  },
  errors: [
    {
      error_message: 'Critical: low battery SOH.',
      error_name: 'UNDER_VOLT_ALARM',
      last_occurrence: '2020-02-15 01:23:45',
      device_sn: '048572340857NND',
      error_code: '4.5.1'
    },
    {
      error_message: 'Critical: low battery SOH.',
      error_name: 'UNDER_VOLT_ALARM',
      last_occurrence: '2020-02-15 01:23:45',
      device_sn: '048572340857NND',
      error_code: '4.5.1'
    }
  ]
}

storiesOf('ESSHealthCheck Error List', module).add('Rendered', () => (
  <div className="full-min-height pl-10 pr-10">
    <ESSHealthCheck results={results} />
  </div>
))
