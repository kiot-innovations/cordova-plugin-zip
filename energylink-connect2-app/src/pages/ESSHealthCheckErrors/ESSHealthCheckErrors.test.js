import React from 'react'
import ESSHealthCheckErrors from '.'
import * as i18n from 'shared/i18n'

describe('ESSHealthCheck page', () => {
  const provider = {
    storage: {
      status: {
        results: {
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
          ]
        }
      }
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
    const component = mountWithProvider(<ESSHealthCheckErrors />)(provider)
    expect(component).toMatchSnapshot()
  })
})
