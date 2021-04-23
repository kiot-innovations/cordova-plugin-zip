import React from 'react'
import { storiesOf } from '@storybook/react'
import EQSUpdate from '.'
import { configureStore } from 'state/store'
import { Provider } from 'react-redux'

storiesOf('Storage - FW Update', module)
  .add('Simple', () => {
    const { store } = configureStore({
      storage: {
        deviceUpdate: {
          firmware_update_status: 'RUNNING',
          status_report: [
            {
              serial_number: 'string',
              fw_ver_from: '1.2.3',
              fw_ver_to: '1.2.3',
              progress: 25,
              device_type: 'MIDC'
            },
            {
              device_type: 'SYSTEM_CONFIGURATION',
              fw_ver_from: '',
              fw_ver_to: '',
              progress: 0,
              serial_number: ''
            },
            {
              device_type: 'APPLYING_SETTINGS',
              fw_ver_from: '',
              fw_ver_to: '',
              progress: 0,
              serial_number: ''
            }
          ],
          errors: []
        }
      }
    })

    return (
      <div className="full-min-height">
        <Provider store={store}>
          <EQSUpdate />
        </Provider>
      </div>
    )
  })
  .add('Completed with warnings', () => {
    const { store } = configureStore({
      storage: {
        deviceUpdate: {
          firmware_update_status: 'SUCCEEDED',
          status_report: [
            {
              device_type: 'SYSTEM_CONFIGURATION',
              fw_ver_from: '',
              fw_ver_to: '',
              progress: 100,
              serial_number: ''
            },
            {
              device_type: 'APPLYING_SETTINGS',
              fw_ver_from: '',
              fw_ver_to: '',
              progress: 100,
              serial_number: ''
            },
            {
              serial_number: 'MIDC1',
              fw_ver_from: '1.2.3',
              fw_ver_to: '1.2.3',
              progress: 100,
              device_type: 'MIDC'
            }
          ],
          errors: [
            {
              device_sn: '',
              error_code: '15003',
              error_message:
                'Unknown grid profile is requested, applied fallback profile',
              error_name: 'gateway_grid_profile_unknown_warning',
              last_occurence: '2021-03-22 15:53:12',
              value: {
                unit: '',
                value: 0
              }
            },
            {
              device_sn: 'MIDC1',
              error_code: '15005',
              error_message:
                'Unknown grid profile is requested, applied fallback profile',
              error_name: 'gateway_grid_profile_unknown_warning',
              last_occurence: '2021-03-22 15:53:12',
              value: {
                unit: '',
                value: 0
              }
            }
          ]
        }
      }
    })

    return (
      <div className="full-min-height">
        <Provider store={store}>
          <EQSUpdate />
        </Provider>
      </div>
    )
  })
