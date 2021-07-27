import React from 'react'

import StoragePrediscovery from '.'

import * as i18n from 'shared/i18n'

describe('StoragePrediscovery page', () => {
  const provider = {
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
    site: {
      site: {
        siteKey: 'A_404889'
      }
    },
    storage: {
      prediscovery: {
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
      },
      loadingPrediscovery: false,
      error: ''
    },
    rma: {
      rmaMode: 'NONE'
    },
    pre_discovery_report: {
      devices: [
        {
          serial_number: '048572340857NND',
          device_type: 'MIDC',
          device_fw_ver: '1.2.3'
        },
        {
          serial_number: '048572340857NND',
          device_type: 'Storage Inverter',
          device_fw_ver: '1.2.3'
        },
        {
          serial_number: '048572340857NND',
          device_type: 'Multi I/O Board',
          device_fw_ver: '1.2.3'
        },
        {
          serial_number: '048572340857NND',
          device_type: 'Battery',
          device_fw_ver: '1.2.3'
        },
        {
          serial_number: '048572340857NND',
          device_type: 'Battery',
          device_fw_ver: '1.2.3'
        }
      ]
    }
  }

  beforeEach(() => {
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key} ${params.join('_')}`.trim()
      )
  })

  test('render correctly', () => {
    const { component } = mountWithProvider(<StoragePrediscovery />)(provider)
    expect(component).toMatchSnapshot()
  })
})
