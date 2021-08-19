import { storiesOf } from '@storybook/react'
import React from 'react'
import { Provider } from 'react-redux'

import NoStringInverters from './NoInverters'
import OtherDevicesList, { RetryDiscovery } from './OtherDevicesList'

import { configureStore } from 'state/store'

storiesOf('String Inverters Page', module)
  .add('No Inverters', () => (
    <div className="full-min-height ml-10 mr-10 mt-20">
      <NoStringInverters />
    </div>
  ))
  .add('RetryDiscovery', () => (
    <div className="full-min-height ml-10 mr-10 mt-20">
      <RetryDiscovery />
    </div>
  ))
  .add('Other Devices List', () => {
    const devices = {
      devices: {
        found: [
          {
            SERIAL: 'ConsumptionMeter001ca',
            DEVICE_TYPE: 'Inverter',
            SUBTYPE: 'NOT_USED',
            MODEL: 'inverter'
          },
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
        ],
        progress: {
          progress: [
            {
              TYPE: 'Power Meter',
              PROGR: '100',
              NFOUND: '2'
            }
          ],
          complete: true
        }
      }
    }
    const { store } = configureStore(devices)
    return (
      <div className="full-min-height ml-10 mr-10 mt-20">
        <Provider store={store}>
          <OtherDevicesList />
        </Provider>
      </div>
    )
  })
