import React from 'react'
import { storiesOf } from '@storybook/react'
import { configureStore } from 'state/store'
import { Provider } from 'react-redux'

import PVSSelection from '.'
import { rmaModes } from 'state/reducers/rma';
import { BLESTATUS } from 'state/reducers/network';

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

storiesOf('PVSSelection Page', module).add('Simple', () => {
  const { store } = configureStore(initialState)

  return (
    <div className="full-min-height">
      <Provider store={store}>
        <PVSSelection />
      </Provider>
    </div>
  )
})
