import { storiesOf } from '@storybook/react'
import { clone } from 'ramda'
import React from 'react'
import { Provider } from 'react-redux'

import PVSSelection from '.'

import { BLESTATUS } from 'state/reducers/network'
import { rmaModes } from 'state/reducers/rma'
import { configureStore } from 'state/store'

let initialState = {
  site: {
    sitePVS: [
      {
        deviceSerialNumber: 'ZT3333333000333',
        assignmentEffectiveTimestamp: 1607973762409
      },
      {
        deviceSerialNumber: 'ZT3333333000331',
        assignmentEffectiveTimestamp: 1607973762401
      }
    ]
  },
  network: {
    bluetoothEnabled: true,
    bluetoothStatus: BLESTATUS.DISCOVERY_SUCCESS,
    err: 'ERROR_CONNECTING',
    nearbyDevices: [{ id: 'AA-FF-ID', name: 'ZT3333333000333' }],
    connected: false,
    bleSearching: true
  },
  rma: {
    rmaMode: rmaModes.NONE,
    cloudDeviceTree: {}
  }
}

storiesOf('PVSSelection Page', module)
  .add('Simple', () => {
    const { store } = configureStore(initialState)

    return (
      <div className="full-min-height mt-15">
        <Provider store={store}>
          <PVSSelection />
        </Provider>
      </div>
    )
  })
  .add('Simple with storage', () => {
    let withStorage = clone(initialState)
    withStorage.site.site = {
      hasStorage: true
    }
    const { store } = configureStore(withStorage)

    return (
      <div className="full-min-height mt-15">
        <Provider store={store}>
          <PVSSelection />
        </Provider>
      </div>
    )
  })
