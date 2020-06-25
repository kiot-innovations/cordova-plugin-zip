import React from 'react'
import { storiesOf } from '@storybook/react'
import ESSHealthCheck from '.'

const results = {
  ess_report: {
    last_updated: '2020-02-15 01:23:45',
    battery_status: [
      {
        serial_number: 'string',
        last_updated: '2020-02-15 01:23:45',
        battery_amperage: {
          value: 0,
          unit: 'string'
        },
        battery_voltage: {
          value: 0,
          unit: 'string'
        },
        state_of_charge: {
          value: 0,
          unit: 'string'
        },
        temperature: {
          value: 0,
          unit: 'string'
        }
      },
      {
        serial_number: 'string',
        last_updated: '2020-02-15 01:23:45',
        battery_amperage: {
          value: 0,
          unit: 'string'
        },
        battery_voltage: {
          value: 0,
          unit: 'string'
        },
        state_of_charge: {
          value: 0,
          unit: 'string'
        },
        temperature: {
          value: 0,
          unit: 'string'
        }
      }
    ],
    ess_status: [
      {
        last_updated: '2020-02-15 01:23:45',
        serial_number: 'string',
        enclosure_humidity: {
          value: 0,
          unit: 'string'
        },
        enclosure_temperature: {
          value: 0,
          unit: 'string'
        }
      }
    ],
    hub_plus_status: {
      serial_number: 'string',
      last_updated: '2020-02-15 01:23:45',
      contactor_error: 'NONE',
      contactor_position: 'UNKNOWN',
      grid_voltage_state: 'METER_VOLTAGE_IN_RANGE',
      grid_frequency_state: 'METER_FREQ_IN_RANGE',
      load_voltage_state: 'METER_VOLTAGE_IN_RANGE',
      load_frequency_state: 'METER_FREQ_IN_RANGE',
      hub_temperature: {
        value: 0,
        unit: 'string'
      },
      hub_humidity: {
        value: 0,
        unit: 'string'
      },
      jump_start_voltage: {
        value: 0,
        unit: 'string'
      },
      aux_port_voltage: {
        value: 0,
        unit: 'string'
      },
      main_voltage: {
        value: 0,
        unit: 'string'
      },
      inverter_connection_voltage: {
        value: 0,
        unit: 'string'
      },
      grid_phase1_voltage: {
        value: 0,
        unit: 'string'
      },
      grid_phase2_voltage: {
        value: 0,
        unit: 'string'
      },
      load_phase1_voltage: {
        value: 0,
        unit: 'string'
      },
      load_phase2_voltage: {
        value: 0,
        unit: 'string'
      }
    },
    inverter_status: [
      {
        serial_number: 'string',
        last_updated: '2020-02-15 01:23:45',
        ac_current: {
          value: 0,
          unit: 'string'
        },
        phase_a_current: {
          value: 0,
          unit: 'string'
        },
        phase_b_current: {
          value: 0,
          unit: 'string'
        },
        a_n_voltage: {
          value: 0,
          unit: 'string'
        },
        b_n_voltage: {
          value: 0,
          unit: 'string'
        },
        ac_power: {
          value: 0,
          unit: 'string'
        },
        temperature: {
          value: 0,
          unit: 'string'
        }
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

storiesOf('ESSHealthCheck Page', module)
  .add('Generating report', () => (
    <div className="full-min-height pl-10 pr-10">
      <ESSHealthCheck />
    </div>
  ))
  .add('Error fetching information', () => (
    <div className="full-min-height pl-10 pr-10">
      <ESSHealthCheck error="UNABLE_TO_FETCH" />
    </div>
  ))
  .add('When errors and results found', () => (
    <div className="full-min-height pl-10 pr-10">
      <ESSHealthCheck results={results} />
    </div>
  ))
  .add('When results and no errors found', () => (
    <div className="full-min-height pl-10 pr-10">
      <ESSHealthCheck results={{ ess_report: results.ess_report }} />
    </div>
  ))
