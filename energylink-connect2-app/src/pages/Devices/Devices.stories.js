import React from 'react'
import { Provider } from 'react-redux'
import { storiesOf } from '@storybook/react'

import { configureStore } from 'state/store'

import Devices from '.'

const discoveryInProgress = {
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
      { SERIAL: 'E00110223232323', STATEDESCR: 'NEW' },
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

const discoveryComplete = {
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
    progress: 100,
    discoveryComplete: true
  }
}

const discoveryFailed = {
  pvs: {
    serialNumbers: [
      {
        serial_number: 'E00110223232323'
      },
      {
        serial_number: 'E00110223232324'
      }
    ]
  },
  devices: {
    candidates: [
      { SERIAL: 'E00110223232323', STATEDESCR: 'PLC_STATS_ERROR' },
      { SERIAL: 'E00110223232324', STATEDESCR: 'PLC_STATS_ERROR' }
    ],
    claimingDevices: false,
    claimError: null,
    claimProgress: 0,
    error: null,
    progress: 100,
    discoveryComplete: true
  }
}

storiesOf('MI Discovery', module)
  .add('In Progress', () => {
    const { store } = configureStore(discoveryInProgress)

    return (
      <div className="full-min-height pt-20 pb-20">
        <Provider store={store}>
          <Devices />
        </Provider>
      </div>
    )
  })
  .add('Complete - all found', () => {
    const { store } = configureStore(discoveryComplete)

    return (
      <div className="full-min-height pt-20 pb-20">
        <Provider store={store}>
          <Devices />
        </Provider>
      </div>
    )
  })
  .add('Complete - no devices found', () => {
    const { store } = configureStore(discoveryFailed)

    return (
      <div className="full-min-height pt-20 pb-20">
        <Provider store={store}>
          <Devices />
        </Provider>
      </div>
    )
  })
