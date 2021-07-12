import { action } from '@storybook/addon-actions/dist'
import { storiesOf } from '@storybook/react'
import React from 'react'
import { Provider } from 'react-redux'

import SNManualEntry from './SNManualEntry'

import SNList from '.'

import { configureStore } from 'state/store'

let initialState = {
  devices: {
    found: [{ SERIAL: '194355110333120', DEVICE_TYPE: 'Inverter' }]
  },
  global: {
    canAccessScandit: true
  },
  pvs: {
    serialNumbers: [
      {
        serial_number: 'E00121852014339',
        type: 'MI',
        model: 'Type E',
        bounding_box: {
          left: 504,
          top: 451,
          width: 1029,
          height: 86
        }
      },
      {
        serial_number: 'E00121852014348',
        type: 'MI',
        model: 'Type E',
        bounding_box: {
          left: 2655,
          top: 465,
          width: 1013,
          height: 75
        }
      },
      {
        serial_number: 'E00121929013075',
        type: 'MI',
        model: 'Type E',
        bounding_box: {
          left: 504,
          top: 848,
          width: 1009,
          height: 77
        }
      }
    ]
  },
  inventory: {
    bom: [
      { item: 'AC_MODULES', value: '0' },
      { item: 'DC_MODULES', value: '0' },
      { item: 'STRING_INVERTERS', value: '0' },
      { item: 'EXTERNAL_METERS', value: '0' },
      { item: 'ESS', value: '0' }
    ]
  }
}

storiesOf('Serial Number List Page', module)
  .add('Empty', () => {
    const { store } = configureStore(initialState)
    return (
      <div className="full-min-height pt-20 pb-20 pl-10 pr-10">
        <Provider store={store}>
          <SNList />
        </Provider>
      </div>
    )
  })
  .add('SNManualEntry', () => {
    const { store } = configureStore({})

    return (
      <div className="full-min-height pt-20 pb-20 pl-10 pr-10">
        <Provider store={store}>
          <SNManualEntry serialNumber="" callback={action('callback called')} />
        </Provider>
      </div>
    )
  })
