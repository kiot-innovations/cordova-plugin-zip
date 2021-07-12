import { storiesOf } from '@storybook/react'
import React from 'react'
import { Provider } from 'react-redux'

import ESSDeviceMappingSuccess from '.'

import { configureStore } from 'state/store'

storiesOf('ESSDeviceMappingSuccess Page', module).add('Single', () => {
  const { store } = configureStore({
    storage: {
      componentMapping: {
        component_mapping: {
          ess_list: [
            {
              batteries: [
                {
                  device_type: 'BATTERY',
                  fw_ver: '1.2',
                  last_mapped: '2020-10-14 17:35:08',
                  serial_number: '17'
                },
                {
                  device_type: 'BATTERY',
                  fw_ver: '1.2',
                  last_mapped: '2020-10-14 17:35:08',
                  serial_number: '29'
                }
              ],
              inverter: {
                device_type: 'STORAGE_INVERTER',
                fw_ver: '10600.386',
                last_mapped: '2020-10-14 17:35:08',
                serial_number: '00001B3E5A44'
              },
              mio_board: {
                device_type: 'MIO',
                fw_ver: '0.6.4',
                last_mapped: '2020-10-14 17:35:08',
                serial_number: 'Serial-MIO-Mercury'
              }
            }
          ],
          gateway: {
            device_type: 'GATEWAY',
            fw_ver: 'v1.08.415',
            last_mapped: '2020-10-14 17:35:08',
            serial_number: 'F21903001960'
          },
          hub_plus: {
            device_type: 'MIDC',
            fw_ver: '0.6.16',
            last_mapped: '2020-10-14 17:35:08',
            serial_number: 'SW2036850005505.00003'
          }
        },
        component_mapping_status: 'SUCCEEDED',
        errors: []
      }
    }
  })

  return (
    <div className="full-min-height pl-10 pr-10">
      <Provider store={store}>
        <ESSDeviceMappingSuccess />
      </Provider>
    </div>
  )
})
