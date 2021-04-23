import React from 'react'
import { storiesOf } from '@storybook/react'
import { clone } from 'ramda'
import Devices from '.'
import { configureStore } from 'state/store'
import { Provider } from 'react-redux'

const state = {
  pvs: {
    serialNumbers: [
      {
        serial_number: 'E00110223232323',
        indicator: 'MI_OK',
        STATEDESCR: 'OK'
      },
      {
        serial_number: 'E00110223232324',
        indicator: 'MI_OK',
        STATEDESCR: 'OK'
      },
      {
        serial_number: 'E00110223232323',
        indicator: 'MI_OK',
        STATEDESCR: 'OK'
      },
      {
        serial_number: 'E00110223232324',
        indicator: 'MI_OK',
        STATEDESCR: 'OK'
      },
      {
        serial_number: 'E00110223232323',
        indicator: 'MI_OK',
        STATEDESCR: 'OK'
      },
      {
        serial_number: 'E00110223232324',
        indicator: 'MI_OK',
        STATEDESCR: 'OK'
      },
      {
        serial_number: 'E00110223232323',
        indicator: 'MI_OK',
        STATEDESCR: 'OK'
      },
      {
        serial_number: 'E00110223232324',
        indicator: 'MI_OK',
        STATEDESCR: 'OK'
      },
      {
        serial_number: 'E00110223232323',
        indicator: 'MI_OK',
        STATEDESCR: 'OK'
      },
      {
        serial_number: 'E00110223232324',
        indicator: 'MI_OK',
        STATEDESCR: 'OK'
      },
      {
        serial_number: 'E00110223232323',
        indicator: 'MI_OK',
        STATEDESCR: 'OK'
      },
      {
        serial_number: 'E00110223232324',
        indicator: 'MI_OK',
        STATEDESCR: 'OK'
      },
      {
        serial_number: 'E00110223232323',
        indicator: 'MI_OK',
        STATEDESCR: 'OK'
      },
      {
        serial_number: 'E00110223232324',
        indicator: 'MI_OK',
        STATEDESCR: 'OK'
      },
      {
        serial_number: 'E00110223232323',
        indicator: 'MI_OK',
        STATEDESCR: 'OK'
      },
      {
        serial_number: 'E00110223232324',
        indicator: 'MI_OK',
        STATEDESCR: 'OK'
      },
      {
        serial_number: 'E00110223232323',
        indicator: 'MI_OK',
        STATEDESCR: 'OK'
      },
      {
        serial_number: 'E00110223232324',
        indicator: 'MI_OK',
        STATEDESCR: 'OK'
      },
      {
        serial_number: 'E00110223232323',
        indicator: 'MI_OK',
        STATEDESCR: 'OK'
      },
      {
        serial_number: 'E00110223232324',
        indicator: 'MI_OK',
        STATEDESCR: 'OK'
      },
      {
        serial_number: 'E00110223232323',
        indicator: 'MI_OK',
        STATEDESCR: 'OK'
      },
      {
        serial_number: 'E00110223232324',
        indicator: 'MI_OK',
        STATEDESCR: 'OK'
      },
      {
        serial_number: 'E00110223232323',
        indicator: 'MI_OK',
        STATEDESCR: 'OK'
      },
      {
        serial_number: 'E00110223232324',
        indicator: 'MI_OK',
        STATEDESCR: 'OK'
      }
    ]
  },
  devices: {
    candidates: [
      { SERIAL: 'E00110223232323', STATEDESCR: 'OK' },
      { SERIAL: 'E00110223232324', STATEDESCR: 'OK' }
    ],
    claimingDevices: false,
    claimError: null,
    claimProgress: 0,
    error: null,
    progress: 10,
    discoverComplete: false
  }
}

const stateClaim = clone(state)

stateClaim.devices.claimingDevices = true
stateClaim.devices.claimProgress = 30

const stateClaimed = clone(stateClaim)

stateClaimed.devices.claimingDevices = false
stateClaimed.devices.claimProgress = 100
stateClaimed.devices.discoverComplete = true

storiesOf('Devices', module)
  .add('Starting', () => {
    const { store } = configureStore(state)

    return (
      <div className="full-min-height">
        <Provider store={store}>
          <Devices />
        </Provider>
      </div>
    )
  })
  .add('Claiming', () => {
    const { store } = configureStore(stateClaim)

    return (
      <div className="full-min-height">
        <Provider store={store}>
          <Devices />
        </Provider>
      </div>
    )
  })
  .add('Claimed', () => {
    const { store } = configureStore(stateClaimed)

    return (
      <div className="full-min-height">
        <Provider store={store}>
          <Devices />
        </Provider>
      </div>
    )
  })
