import React from 'react'

import ESSDeviceMapping from '.'

import * as i18n from 'shared/i18n'

describe('ESSDeviceMapping component', () => {
  const historyMock = { block: jest.fn() }

  beforeEach(() => {
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  const mockedStore = {
    storage: {
      componentMapping: {
        component_mapping_status: 'RUNNING',
        component_mapping: {
          ess_list: [
            {
              inverter: {
                serial_number: 'string',
                last_mapped: '2020-02-15 01:23:45',
                device_type: 'MIDC',
                device_fw_ver: '1.2.3'
              },
              mio_board: {
                serial_number: 'string',
                last_mapped: '2020-02-15 01:23:45',
                device_type: 'MIDC',
                device_fw_ver: '1.2.3'
              },
              batteries: [
                {
                  serial_number: 'string',
                  last_mapped: '2020-02-15 01:23:45',
                  device_type: 'MIDC',
                  device_fw_ver: '1.2.3'
                }
              ]
            }
          ],
          hub_plus: {
            serial_number: 'string',
            last_mapped: '2020-02-15 01:23:45',
            device_type: 'MIDC',
            device_fw_ver: '1.2.3'
          },
          gateway: {
            serial_number: 'string',
            last_mapped: '2020-02-15 01:23:45',
            device_type: 'MIDC',
            device_fw_ver: '1.2.3'
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
    }
  }

  test('renders correctly', () => {
    const component = mountWithProvider(
      <ESSDeviceMapping history={historyMock} />
    )(mockedStore)
    expect(component).toMatchSnapshot()
  })
})
