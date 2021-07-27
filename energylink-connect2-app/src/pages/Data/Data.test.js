import React from 'react'
import Data from '.'
import { DATA_SOURCES } from 'state/actions/user'
import * as userActions from 'state/actions/user'
import * as i18n from 'shared/i18n'

describe('Data page', () => {
  const provider = {
    storage: {
      statusReport: {
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
              },
              ess_meter_reading: {
                last_updated: '2020-02-15 01:23:45',
                agg_power: {
                  value: 0,
                  unit: 'string'
                },
                meter_a: {
                  reading: {
                    last_updated: '2020-02-15 01:23:45',
                    current: {
                      value: 0,
                      unit: 'string'
                    },
                    voltage: {
                      value: 0,
                      unit: 'string'
                    },
                    power: {
                      value: 0,
                      unit: 'string'
                    }
                  }
                },
                meter_b: {
                  reading: {
                    last_updated: '2020-02-15 01:23:45',
                    current: {
                      value: 0,
                      unit: 'string'
                    },
                    voltage: {
                      value: 0,
                      unit: 'string'
                    },
                    power: {
                      value: 0,
                      unit: 'string'
                    }
                  }
                }
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
          ],
          ess_state: {
            storage_controller_status: 'UNKNOWN',
            operational_mode: 'UNKNOWN',
            permission_to_operate: true
          }
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
    },
    global: {
      selectedEnergyGraph: userActions.GRAPHS.ENERGY,
      selectedDataSource: DATA_SOURCES.LIVE
    },
    pvs: {
      miData: null
    },
    devices: {
      found: [
        {
          SERIAL: 'ProductionMeter001p',
          DEVICE_TYPE: 'Power Meter',
          SUBTYPE: 'GROSS_PRODUCTION_LINESIDE'
        },
        {
          SERIAL: 'ConsumptionMeter001c',
          DEVICE_TYPE: 'Power Meter',
          SUBTYPE: 'NOT_USED'
        }
      ]
    },
    energyLiveData: {
      liveData: {}
    }
  }

  beforeEach(() => {
    const baseTime = 1566947470000 // Aug 27 2019 23:11:10 GMT-0000
    jest.spyOn(Date, 'now').mockImplementation(() => baseTime)

    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key} ${params.join('_')}`.trim()
      )
  })

  test('render correctly', () => {
    const { component } = mountWithProvider(<Data />)(provider)
    expect(component).toMatchSnapshot()
  })
})
