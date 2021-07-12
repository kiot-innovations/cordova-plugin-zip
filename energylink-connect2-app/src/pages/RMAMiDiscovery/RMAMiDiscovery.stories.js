import { storiesOf } from '@storybook/react'
import React from 'react'
import { Provider } from 'react-redux'

import RMAMiDiscovery from '.'

import { configureStore } from 'state/store'

const mixedCandidates = {
  devices: {
    found: [
      { SERIAL: 'E00121852014339', DEVICE_TYPE: 'Inverter', STATEDESCR: 'OK' }
    ],
    candidates: [
      {
        SERIAL: 'E00121852014339',
        type: 'MI',
        model: 'Type E',
        STATEDESCR: 'OK'
      },
      {
        SERIAL: 'E00121852014348',
        type: 'MI',
        model: 'Type E',
        STATEDESCR: 'PLC_STATS_ERROR'
      }
    ]
  },
  pvs: {
    serialNumbers: [
      {
        serial_number: 'E00121852014339',
        type: 'MI',
        model: 'Type E'
      },
      {
        serial_number: 'E00121852014348',
        type: 'MI',
        model: 'Type E'
      },
      {
        serial_number: 'E00121929013075',
        type: 'MI',
        model: 'Type E'
      }
    ]
  }
}
const allFound = {
  devices: {
    found: [
      { SERIAL: 'E00121852014339', DEVICE_TYPE: 'Inverter', STATEDESCR: 'OK' }
    ],
    candidates: [
      {
        SERIAL: 'E00121852014339',
        type: 'MI',
        model: 'Type E',
        STATEDESCR: 'OK'
      },
      {
        SERIAL: 'E00121852014348',
        type: 'MI',
        model: 'Type E',
        STATEDESCR: 'OK'
      },
      {
        SERIAL: 'E00121929013075',
        type: 'MI',
        model: 'Type E',
        STATEDESCR: 'OK'
      }
    ]
  },
  pvs: {
    serialNumbers: [
      {
        serial_number: 'E00121852014339',
        type: 'MI',
        model: 'Type E'
      },
      {
        serial_number: 'E00121852014348',
        type: 'MI',
        model: 'Type E'
      },
      {
        serial_number: 'E00121929013075',
        type: 'MI',
        model: 'Type E'
      }
    ]
  }
}
const noneFound = {
  devices: {
    found: [
      { SERIAL: 'E00121852014339', DEVICE_TYPE: 'Inverter', STATEDESCR: 'OK' }
    ],
    candidates: [
      {
        SERIAL: 'E00121852014339',
        type: 'MI',
        model: 'Type E',
        STATEDESCR: 'PLC_STATS_ERROR'
      },
      {
        SERIAL: 'E00121852014348',
        type: 'MI',
        model: 'Type E',
        STATEDESCR: 'PLC_STATS_ERROR'
      },
      {
        SERIAL: 'E00121929013075',
        type: 'MI',
        model: 'Type E',
        STATEDESCR: 'PLC_STATS_ERROR'
      }
    ]
  },
  pvs: {
    serialNumbers: [
      {
        serial_number: 'E00121852014339',
        type: 'MI',
        model: 'Type E'
      },
      {
        serial_number: 'E00121852014348',
        type: 'MI',
        model: 'Type E'
      },
      {
        serial_number: 'E00121929013075',
        type: 'MI',
        model: 'Type E'
      }
    ]
  }
}
storiesOf('RMA - MI Discovery', module)
  .add('One found, one faulty, one pending', () => {
    const { store } = configureStore(mixedCandidates)

    return (
      <div id="modal-root" className="full-min-height pt-20">
        <Provider store={store}>
          <RMAMiDiscovery />
        </Provider>
      </div>
    )
  })
  .add('All found', () => {
    const { store } = configureStore(allFound)

    return (
      <div id="modal-root" className="full-min-height pt-20">
        <Provider store={store}>
          <RMAMiDiscovery />
        </Provider>
      </div>
    )
  })
  .add('None found', () => {
    const { store } = configureStore(noneFound)

    return (
      <div id="modal-root" className="full-min-height pt-20">
        <Provider store={store}>
          <RMAMiDiscovery />
        </Provider>
      </div>
    )
  })
