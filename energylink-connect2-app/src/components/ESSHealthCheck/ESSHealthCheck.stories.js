import React from 'react'
import { storiesOf } from '@storybook/react'
import { linkTo } from '@storybook/addon-links'

import ESSHealthCheck from '.'
import { action } from '@storybook/addon-actions/dist'

const results = {
  ess_report: {
    last_updated: '2020-02-15 01:23:45',
    battery_status: [
      {
        serial_number: '048572340857NND',
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
        serial_number: '048572340857NNA',
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
        serial_number: '048572340857NNN',
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
      serial_number: '048572340857NNF',
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
        serial_number: '048572340857NNO',
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
    },
    {
      error_name: 'UNDER_VOLT_ALARM',
      last_occurrence: '2020-02-15 01:23:45',
      error_code: '4.5.1',
      device_sn: '048572340857NNF',
      error_message: 'Critical: HubPlus Failing.',
      value: {
        value: 0,
        unit: 'string'
      }
    }
  ]
}

const actions = {
  onRetry: linkTo('ESSHealthCheck Page', 'Generating report'),
  onContinue: action('Continue action triggered'),
  onSeeErrors: linkTo('ESSHealthCheck Error List')
}

storiesOf('ESSHealthCheck Page', module)
  .add('Generating report', () => (
    <div className="full-min-height pl-10 pr-10">
      <ESSHealthCheck {...actions} />
    </div>
  ))
  .add('Error fetching information', () => (
    <div className="full-min-height pl-10 pr-10">
      <ESSHealthCheck error="UNABLE_TO_FETCH" {...actions} />
    </div>
  ))
  .add('When errors and results found', () => (
    <div className="full-min-height pl-10 pr-10">
      <ESSHealthCheck results={results} {...actions} />
    </div>
  ))
  .add('When results and no errors found', () => (
    <div className="full-min-height pl-10 pr-10">
      <ESSHealthCheck
        results={{ ess_report: results.ess_report }}
        {...actions}
      />
    </div>
  ))
