import React from 'react'
import { storiesOf } from '@storybook/react'
import RMAMiDiscovery from '.'
import { configureStore } from 'state/store'
import { Provider } from 'react-redux'

storiesOf('RMA - MI Discovery', module).add('Simple', () => {
  const { store } = configureStore({
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
  })

  return (
    <div id="modal-root" className="full-min-height pl-10 pr-10">
      <Provider store={store}>
        <RMAMiDiscovery />
      </Provider>
    </div>
  )
})
