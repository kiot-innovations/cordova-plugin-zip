import React from 'react'
import { storiesOf } from '@storybook/react'
import EQSUpdate from '.'
import { configureStore } from 'state/store'
import { Provider } from 'react-redux'

storiesOf('Storage - FW Update', module).add('Simple', () => {
  const { store } = configureStore({
    storage: {
      deviceUpdate: {
        firmware_update_status: 'RUNNING',
        status_report: [
          {
            serial_number: 'string',
            fw_ver_from: '1.2.3',
            fw_ver_to: '1.2.3',
            progress: 0,
            device_type: 'MIDC'
          }
        ]
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
  })

  return (
    <div className="full-min-height">
      <Provider store={store}>
        <EQSUpdate />
      </Provider>
    </div>
  )
})
