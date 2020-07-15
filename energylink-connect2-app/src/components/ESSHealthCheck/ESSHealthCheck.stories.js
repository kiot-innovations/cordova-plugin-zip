import React from 'react'
import { storiesOf } from '@storybook/react'
import { linkTo } from '@storybook/addon-links'

import ESSHealthCheck from '.'
import { action } from '@storybook/addon-actions/dist'

const results = {
  errors: [],
  ess_report: {
    battery_status: [
      {
        battery_amperage: {
          unit: 'A',
          value: 0
        },
        battery_voltage: {
          unit: 'V',
          value: 53.2
        },
        last_updated: '2020-07-14 23:03:59',
        serial_number: '',
        state_of_charge: {
          unit: '%',
          value: 0.88
        },
        temperature: {
          unit: 'C',
          value: 26.3
        }
      }
    ],
    ess_state: [
      {
        operational_mode: 'STANDBY',
        permission_to_operate: false,
        storage_controller_status: 'NOT_RUNNING'
      }
    ],
    ess_status: [
      {
        enclosure_humidity: {
          unit: '%',
          value: 21
        },
        enclosure_temperature: {
          unit: 'C',
          value: 33
        },
        ess_meter_reading: {
          agg_power: {
            unit: 'kW',
            value: -0.028
          },
          last_updated: '2020-07-14 23:03:59',
          meter_a: {
            reading: {
              current: {
                unit: 'A',
                value: 0
              },
              last_updated: '2020-07-14 23:03:59',
              power: {
                unit: 'W',
                value: 0
              },
              voltage: {
                unit: 'V',
                value: 120.26
              }
            }
          },
          meter_b: {
            reading: {
              current: {
                unit: 'A',
                value: 0
              },
              last_updated: '2020-07-14 23:03:59',
              power: {
                unit: 'W',
                value: 0
              },
              voltage: {
                unit: 'V',
                value: 120.26
              }
            }
          }
        },
        last_updated: '2020-07-14 23:03:59',
        serial_number: '00001B3E5A44_29_17'
      }
    ],
    hub_plus_status: {
      aux_port_voltage: {
        unit: 'V',
        value: 11.364
      },
      contactor_error: 'NONE',
      contactor_position: 'CLOSED',
      grid_frequency_state: 'METER_FREQ_IN_RANGE',
      grid_phase1_voltage: {
        unit: 'V',
        value: 121.2
      },
      grid_phase2_voltage: {
        unit: 'V',
        value: 121.30000000000001
      },
      grid_voltage_state: 'METER_VOLTAGE_IN_RANGE',
      hub_humidity: {
        unit: '%',
        value: 26
      },
      hub_temperature: {
        unit: 'C',
        value: 29
      },
      inverter_connection_voltage: {
        unit: 'V',
        value: 0.267
      },
      jump_start_voltage: {
        unit: 'V',
        value: 0.748
      },
      last_updated: '2020-07-14 23:04:07',
      load_frequency_state: 'METER_FREQ_IN_RANGE',
      load_phase1_voltage: {
        unit: 'V',
        value: 121.2
      },
      load_phase2_voltage: {
        unit: 'V',
        value: 121.4
      },
      load_voltage_state: 'METER_VOLTAGE_IN_RANGE',
      main_voltage: {
        unit: 'V',
        value: 11.243
      },
      serial_number: 'Serial-MIDC-Mercury'
    },
    inverter_status: [
      {
        a_n_voltage: {
          unit: 'V',
          value: 120.26
        },
        ac_current: {
          unit: 'A',
          value: 0
        },
        ac_power: {
          unit: 'kW',
          value: -0.028
        },
        b_n_voltage: {
          unit: 'V',
          value: 120.26
        },
        last_updated: '2020-07-14 23:03:59',
        phase_a_current: {
          unit: 'A',
          value: 0
        },
        phase_b_current: {
          unit: 'A',
          value: 0
        },
        serial_number: '00001B3E5A44',
        temperature: {
          unit: 'C',
          value: 27.68
        }
      }
    ],
    last_updated: '2020-07-14 23:04:09'
  }
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
