import { storiesOf } from '@storybook/react'
import React from 'react'
import { Provider } from 'react-redux'

import StoragePrediscovery from '.'

import { configureStore } from 'state/store'

storiesOf('Storage - Prediscovery Screen', module).add('Simple', () => {
  const { store } = configureStore({
    devices: {
      found: [
        {
          SERIAL: 'ConsumptionMeter001ca',
          DEVICE_TYPE: 'Inverter',
          SUBTYPE: 'NOT_USED',
          MODEL: 'inverter'
        },
        {
          SERIAL: 'ConsumptionMeter002ca',
          DEVICE_TYPE: 'Inverter',
          SUBTYPE: 'NOT_USED',
          MODEL: 'inverter'
        }
      ]
    }
  })

  return (
    <div className="full-min-height">
      <Provider store={store}>
        <StoragePrediscovery />
      </Provider>
    </div>
  )
})
