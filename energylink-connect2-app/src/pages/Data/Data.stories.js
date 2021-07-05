import React from 'react'
import { Provider } from 'react-redux'
import { storiesOf } from '@storybook/react'
import { configureStore } from 'state/store'
import Data from '.'

const noMeters = {
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
  devices: {
    found: [
      {
        SERIAL: 'ProductionMeter001p',
        DEVICE_TYPE: 'Power Meter',
        SUBTYPE: 'NOT_USED'
      },
      {
        SERIAL: 'ConsumptionMeter001c',
        DEVICE_TYPE: 'Power Meter',
        SUBTYPE: 'NOT_USED'
      }
    ]
  },
  energyLiveData: {
    liveData: {
      [new Date().toISOString()]: {
        isSolarAvailable: false,
        ess_en: -162.80300000000005,
        ess_p: -0.041,
        net_en: -2157.16,
        net_p: -0.8628927917480469,
        pv_en: 2228.32,
        site_load_en: -91.64299999999974,
        site_load_p: -0.016651275634765615,
        soc: 0.9500000000000001,
        rawData: {
          ess_en: -162.80300000000005,
          ess_p: -0.041,
          net_en: -2157.16,
          net_p: -0.8628927917480469,
          pv_en: 2228.32,
          pv_p: 0.8872415161132813,
          site_load_en: -91.64299999999974,
          site_load_p: -0.016651275634765615,
          soc: 0.9500000000000001
        }
      }
    }
  }
}
const withMeters = {
  storage: {
    statusReportError: 'Error Here'
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
    liveData: {
      [new Date().toISOString()]: {
        isSolarAvailable: true,
        ess_en: -162.80300000000005,
        ess_p: -0.041,
        net_en: -2157.16,
        net_p: -0.8628927917480469,
        pv_en: 2228.32,
        pv_p: 0.8872415161132813,
        site_load_en: -91.64299999999974,
        site_load_p: -0.016651275634765615,
        soc: 0.9500000000000001,
        rawData: {
          ess_en: -162.80300000000005,
          ess_p: -0.041,
          net_en: -2157.16,
          net_p: -0.8628927917480469,
          pv_en: 2228.32,
          pv_p: 0.8872415161132813,
          site_load_en: -91.64299999999974,
          site_load_p: -0.016651275634765615,
          soc: 0.9500000000000001
        }
      }
    }
  }
}

storiesOf('Data', module)
  .add('With Meters', () => {
    const { store } = configureStore(withMeters)

    return (
      <div className="full-min-height pt-20 pb-20 pl-10 pr-10">
        <Provider store={store}>
          <Data />
        </Provider>
      </div>
    )
  })
  .add('Without Meter Configs', () => {
    const { store } = configureStore(noMeters)

    return (
      <div className="full-min-height pt-20 pb-20 pl-10 pr-10">
        <Provider store={store}>
          <Data />
        </Provider>
      </div>
    )
  })
