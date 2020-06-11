import React from 'react'
import { storiesOf } from '@storybook/react'
import ESSHealthCheck from '.'

const errors = [{ code: '234' }]

const results = {
  lastUpdatedOn: '2020-04-23T22:06:41.135Z',
  BatteryStatusReports: [
    {
      sn: 'string',
      lastUpdated: '2020-04-23T22:06:41.135Z',
      available_energy: '54.1',
      state_of_charge: '50.0',
      internal_battery_voltage: '12.1',
      max_module_temperature: '23.2',
      min_module_temperature: '2.1'
    }
  ],
  BatteryErrors: {
    BatteryErrorReport: [
      {
        errorName: 'UNDER_VOLT_ALARM',
        lastOccurrence: '2020-04-23T22:06:41.135Z',
        errorCode: '4.5.1',
        deviceSN: '048572340857NND'
      }
    ]
  },
  InverterStatusReports: [
    {
      sn: 'string',
      lastUpdated: '2020-04-23T22:06:41.135Z',
      ac_current: 0,
      phase_a_current: 0,
      phase_b_current: 0,
      phase_c_current: 0,
      a_b_voltage: 0,
      b_c_voltage: 0,
      c_a_voltage: 0,
      a_n_voltage: 0,
      b_n_voltage: 0,
      c_n_voltage: 0,
      ac_power: 0,
      dc_current: 0,
      dc_voltage: 0,
      dc_power: 0
    }
  ],
  InverterErrors: {
    InverterErrorReport: [
      {
        errorName: 'UNDER_VOLT_ALARM',
        lastOccurrence: '2020-04-23T22:06:41.135Z',
        errorCode: '4.5.1',
        deviceSN: '048572340857NND'
      }
    ]
  },
  HubPlusStatusReport: {
    HubPlusStatusReport: {
      sn: 'string',
      lastUpdated: '2020-04-23T22:06:41.135Z',
      contactorPosition: '0',
      contactorError: '0',
      gridVoltageState: 'METER_VOLTAGE_IN_RANGE',
      gridFrequencyState: 'METER_FREQ_IN_RANGE',
      loadVoltageState: 'METER_VOLTAGE_IN_RANGE',
      loadFrequencyState: 'METER_FREQ_IN_RANGE',
      hubTemperature: '24',
      hubHumidity: '23',
      jumpStartVoltage: 0,
      auxPortVoltage: 0,
      mainVoltage: 0,
      inverterConnectionVoltage: 0,
      gridPhase1Voltage: 0,
      gridPhase2Voltage: 0,
      loadPhase1Voltage: 0,
      loadPhase2Voltage: 0
    }
  },
  HubPlusErrors: {
    HubPlusErrorReport: [
      {
        errorName: 'UNDER_VOLT_ALARM',
        lastOccurrence: '2020-04-23T22:06:41.136Z',
        errorCode: '4.5.1',
        deviceSN: '048572340857NND'
      }
    ]
  },
  AllInOneStatusReports: [
    {
      lastUpdated: '2020-04-23T22:06:41.136Z',
      sn: 'string',
      enclosureTemperature: '21',
      enclosureHumidity: '25'
    }
  ],
  AllInOneErrors: {
    AllInOneErrorReport: [
      {
        errorName: 'UNDER_VOLT_ALARM',
        lastOccurrence: '2020-04-23T22:06:41.136Z',
        errorCode: '4.5.1',
        deviceSN: '048572340857NND'
      }
    ]
  }
}

storiesOf('ESSHealthCheck Page', module)
  .add('Generating report', () => (
    <div className="full-min-height pl-10 pr-10">
      <ESSHealthCheck errors={[]} />
    </div>
  ))
  .add('When errors found', () => (
    <div className="full-min-height pl-10 pr-10">
      <ESSHealthCheck errors={errors} />
    </div>
  ))
  .add('When results found', () => (
    <div className="full-min-height pl-10 pr-10">
      <ESSHealthCheck errors={errors} results={results} />
    </div>
  ))
