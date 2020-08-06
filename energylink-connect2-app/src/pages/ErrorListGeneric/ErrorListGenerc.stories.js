import React from 'react'
import { storiesOf } from '@storybook/react'
import ErrorList from '.'

storiesOf('Error list - All with known errors', module).add(
  'with unknown errors',
  () => (
    <div className="full-min-height">
      <ErrorList
        errors={[
          {
            device_sn: 'Serial-MIO-Mercury',
            error_code: '13042',
            error_message: 'esshub_firmware_update_failure_critical',
            error_name: 'esshub_firmware_update_failure_critical',
            last_occurence: '2020-07-16 21:50:29',
            value: {
              unit: '',
              value: 0
            }
          },
          {
            device_sn: 'Serial-MIDC-Mercury',
            error_code: '31028',
            error_message: 'hubplus_firmware_update_failure_critical',
            error_name: 'hubplus_firmware_update_failure_critical',
            last_occurence: '2020-07-16 21:50:29',
            value: {
              unit: '',
              value: 0
            }
          }
        ]}
      />
    </div>
  )
)
