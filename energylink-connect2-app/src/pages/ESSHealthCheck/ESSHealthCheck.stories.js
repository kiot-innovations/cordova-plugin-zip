import React from 'react'
import { storiesOf } from '@storybook/react'
import { configureStore } from 'state/store'
import { Provider } from 'react-redux'

import ESSHealthCheck from './index'

storiesOf('Storage - Health Check', module).add('Faulty Report', () => {
  const { store } = configureStore({
    storage: {
      status: {
        error: '',
        waiting: false,
        results: {
          errors: [],
          ess_report: {
            battery_status: [null],
            ess_state: [
              {
                operational_mode: 'SELF_CONSUMPTION',
                permission_to_operate: false,
                storage_controller_status: 'RUNNING'
              }
            ],
            ess_status: [
              {
                enclosure_humidity: {
                  unit: '%',
                  value: 17
                },
                enclosure_temperature: {
                  unit: 'C',
                  value: 30
                },
                ess_meter_reading: null,
                last_updated: '2020-09-29 23:54:43',
                serial_number: '00001B3DDACD_178_15'
              }
            ],
            hub_plus_status: {
              aux_port_voltage: {
                unit: 'V',
                value: 11.353
              },
              contactor_error: 'NONE',
              contactor_position: 'CLOSED',
              grid_frequency_state: 'METER_FREQ_IN_RANGE',
              grid_phase1_voltage: {
                unit: 'V',
                value: 123
              },
              grid_phase2_voltage: {
                unit: 'V',
                value: 122.60000000000001
              },
              grid_voltage_state: 'METER_VOLTAGE_IN_RANGE',
              hub_humidity: {
                unit: '%',
                value: 21
              },
              hub_temperature: {
                unit: 'C',
                value: 28
              },
              inverter_connection_voltage: {
                unit: 'V',
                value: 0.267
              },
              jump_start_voltage: {
                unit: 'V',
                value: 0.594
              },
              last_updated: '2020-09-29 23:54:51',
              load_frequency_state: 'METER_FREQ_IN_RANGE',
              load_phase1_voltage: {
                unit: 'V',
                value: 122.80000000000001
              },
              load_phase2_voltage: {
                unit: 'V',
                value: 122.60000000000001
              },
              load_voltage_state: 'METER_VOLTAGE_IN_RANGE',
              main_voltage: {
                unit: 'V',
                value: 11.254
              },
              serial_number: 'Serial-MIDC-Saturn'
            },
            inverter_status: [null],
            last_updated: '2020-09-29 23:54:53'
          }
        }
      }
    },
    devices: {
      progress: 100
    },
    rma: {
      pvs: true
    }
  })

  return (
    <div className="full-min-height pl-10 pr-10">
      <Provider store={store}>
        <ESSHealthCheck />
      </Provider>
    </div>
  )
})
