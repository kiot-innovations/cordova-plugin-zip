import React from 'react'
import { storiesOf } from '@storybook/react'
import { configureStore } from 'state/store'
import { Provider } from 'react-redux'

import ESSHealthCheck from './index'

const faultyReport = {
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
}
const successfulReport = {
  storage: {
    status: {
      error: '',
      waiting: false,
      results: {
        errors: [],
        ess_report: {
          battery_status: [
            {
              battery_amperage: {
                unit: 'A',
                value: 9
              },
              battery_voltage: {
                unit: 'V',
                value: 53.7
              },
              last_updated: '2020-09-30 22:05:29',
              serial_number: '',
              state_of_charge: {
                unit: '%',
                value: 73
              },
              temperature: {
                unit: 'C',
                value: 27.3
              }
            },
            {
              battery_amperage: {
                unit: 'A',
                value: 9
              },
              battery_voltage: {
                unit: 'V',
                value: 53.7
              },
              last_updated: '2020-09-30 22:05:29',
              serial_number: 'F2191700087033685504',
              state_of_charge: {
                unit: '%',
                value: 73
              },
              temperature: {
                unit: 'C',
                value: 27.3
              }
            }
          ],
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
                value: 13
              },
              enclosure_temperature: {
                unit: 'C',
                value: 35
              },
              ess_meter_reading: {
                agg_power: {
                  unit: 'kW',
                  value: -0.555
                },
                last_updated: '2020-09-30 22:05:29',
                meter_a: {
                  reading: {
                    current: {
                      unit: 'A',
                      value: 1.84
                    },
                    last_updated: '2020-09-30 22:05:29',
                    power: {
                      unit: 'W',
                      value: 223.17360000000002
                    },
                    voltage: {
                      unit: 'V',
                      value: 121.29
                    }
                  }
                },
                meter_b: {
                  reading: {
                    current: {
                      unit: 'A',
                      value: 1.84
                    },
                    last_updated: '2020-09-30 22:05:29',
                    power: {
                      unit: 'W',
                      value: 223.17360000000002
                    },
                    voltage: {
                      unit: 'V',
                      value: 121.29
                    }
                  }
                }
              },
              last_updated: '2020-09-30 22:05:29',
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
              value: 122
            },
            grid_phase2_voltage: {
              unit: 'V',
              value: 122.2
            },
            grid_voltage_state: 'METER_VOLTAGE_IN_RANGE',
            hub_humidity: {
              unit: '%',
              value: 20
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
              value: 0.616
            },
            last_updated: '2020-09-30 22:05:29',
            load_frequency_state: 'METER_FREQ_IN_RANGE',
            load_phase1_voltage: {
              unit: 'V',
              value: 121.80000000000001
            },
            load_phase2_voltage: {
              unit: 'V',
              value: 122.2
            },
            load_voltage_state: 'METER_VOLTAGE_IN_RANGE',
            main_voltage: {
              unit: 'V',
              value: 11.265
            },
            serial_number: 'Serial-MIDC-Saturn'
          },
          inverter_status: [
            {
              a_n_voltage: {
                unit: 'V',
                value: 121.29
              },
              ac_current: {
                unit: 'A',
                value: 1.84
              },
              ac_power: {
                unit: 'kW',
                value: -0.555
              },
              b_n_voltage: {
                unit: 'V',
                value: 121.29
              },
              last_updated: '2020-09-30 22:05:29',
              phase_a_current: {
                unit: 'A',
                value: 1.84
              },
              phase_b_current: {
                unit: 'A',
                value: 1.84
              },
              serial_number: '00001B3DDACD',
              temperature: {
                unit: 'C',
                value: 31.17
              }
            }
          ],
          last_updated: '2020-09-30 22:05:30'
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
}
storiesOf('Storage - Health Check', module)
  .add('Faulty Report', () => {
    const { store } = configureStore(faultyReport)

    return (
      <div className="full-min-height pl-10 pr-10">
        <Provider store={store}>
          <ESSHealthCheck />
        </Provider>
      </div>
    )
  })
  .add('Successful Report', () => {
    const { store } = configureStore(successfulReport)

    return (
      <div className="full-min-height pl-10 pr-10">
        <Provider store={store}>
          <ESSHealthCheck />
        </Provider>
      </div>
    )
  })
