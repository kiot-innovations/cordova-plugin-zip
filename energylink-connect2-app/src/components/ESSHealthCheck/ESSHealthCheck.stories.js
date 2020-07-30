import React from 'react'
import { storiesOf } from '@storybook/react'
import { linkTo } from '@storybook/addon-links'

import ESSHealthCheck from '.'
import { action } from '@storybook/addon-actions/dist'

const results = {
  errors: [
    {
      device_sn: '00001B3DDACD',
      error_code: '32058',
      error_message: 'f72_external_contactor_malfunction_critical',
      error_name: 'f72_external_contactor_malfunction_critical',
      last_occurence: '2020-07-30 18:37:20',
      value: {
        unit: '',
        value: 256
      }
    },
    {
      device_sn: 'Serial-MIDC-Saturn',
      error_code: '11018',
      error_message: 'hubplus_inverter_aux_under_voltage_warning',
      error_name: 'hubplus_inverter_aux_under_voltage_warning',
      last_occurence: '2020-07-30 18:37:20',
      value: {
        unit: '',
        value: 0
      }
    },
    {
      device_sn: 'Serial-MIDC-Saturn',
      error_code: '31003',
      error_message: 'contactor_stuck_open_critical',
      error_name: 'contactor_stuck_open_critical',
      last_occurence: '2020-07-30 18:37:20',
      value: {
        unit: '',
        value: 1
      }
    }
  ],
  ess_report: {
    battery_status: [
      {
        battery_amperage: {
          unit: 'A',
          value: -0.6
        },
        battery_voltage: {
          unit: 'V',
          value: 52.5
        },
        last_updated: '2020-07-30 18:37:10',
        serial_number: 'F2191700087033751040',
        state_of_charge: {
          unit: '%',
          value: 0.35000000000000003
        },
        temperature: {
          unit: 'C',
          value: 29.1
        }
      }
    ],
    ess_state: [
      {
        operational_mode: 'MANUAL_CHARGE',
        permission_to_operate: false,
        storage_controller_status: 'RUNNING'
      }
    ],
    ess_status: [
      {
        enclosure_humidity: {
          unit: '%',
          value: 20
        },
        enclosure_temperature: {
          unit: 'C',
          value: 33
        },
        ess_meter_reading: {
          agg_power: {
            unit: 'kW',
            value: -0.006
          },
          last_updated: '2020-07-30 18:37:10',
          meter_a: {
            reading: {
              current: {
                unit: 'A',
                value: 0
              },
              last_updated: '2020-07-30 18:37:10',
              power: {
                unit: 'W',
                value: 0
              },
              voltage: {
                unit: 'V',
                value: 0.21
              }
            }
          },
          meter_b: {
            reading: {
              current: {
                unit: 'A',
                value: 0
              },
              last_updated: '2020-07-30 18:37:10',
              power: {
                unit: 'W',
                value: 0
              },
              voltage: {
                unit: 'V',
                value: 0.21
              }
            }
          }
        },
        last_updated: '2020-07-30 18:37:10',
        serial_number: '00001B3DDACD_16777216'
      }
    ],
    hub_plus_status: {
      aux_port_voltage: {
        unit: 'V',
        value: 0
      },
      contactor_error: 'STUCK_OPEN',
      contactor_position: 'OPEN',
      grid_frequency_state: 'METER_FREQ_OUT_RANGE',
      grid_phase1_voltage: {
        unit: 'V',
        value: 79.600000000000009
      },
      grid_phase2_voltage: {
        unit: 'V',
        value: 79.2
      },
      grid_voltage_state: 'METER_VOLTAGE_OUT_RANGE',
      hub_humidity: {
        unit: '%',
        value: 25
      },
      hub_temperature: {
        unit: 'C',
        value: 32
      },
      inverter_connection_voltage: {
        unit: 'V',
        value: 0.267
      },
      jump_start_voltage: {
        unit: 'V',
        value: 0.66
      },
      last_updated: '2020-07-30 18:37:18',
      load_frequency_state: 'METER_FREQ_OUT_RANGE',
      load_phase1_voltage: {
        unit: 'V',
        value: 79.4
      },
      load_phase2_voltage: {
        unit: 'V',
        value: 79.300000000000011
      },
      load_voltage_state: 'METER_VOLTAGE_OUT_RANGE',
      main_voltage: {
        unit: 'V',
        value: 11.21
      },
      serial_number: 'Serial-MIDC-Saturn'
    },
    inverter_status: [
      {
        a_n_voltage: {
          unit: 'V',
          value: 0.21
        },
        ac_current: {
          unit: 'A',
          value: 0
        },
        ac_power: {
          unit: 'kW',
          value: -0.006
        },
        b_n_voltage: {
          unit: 'V',
          value: 0.21
        },
        last_updated: '2020-07-30 18:37:10',
        phase_a_current: {
          unit: 'A',
          value: 0
        },
        phase_b_current: {
          unit: 'A',
          value: 0
        },
        serial_number: '00001B3DDACD',
        temperature: {
          unit: 'C',
          value: 32.43
        }
      }
    ],
    last_updated: '2020-07-30 18:37:20'
  }
}

const actions = {
  onRetry: linkTo('ESSHealthCheck Page', 'Generating report'),
  pathToContinue: action('Continue action triggered'),
  pathToErrors: linkTo('ESSHealthCheck Error List')
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
