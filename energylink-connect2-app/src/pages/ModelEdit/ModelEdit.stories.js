import React from 'react'
import { Provider } from 'react-redux'
import { storiesOf } from '@storybook/react'
import { configureStore } from 'state/store'

import ModelEdit from '.'

const mockedStore = {
  systemConfiguration: {
    submit: {
      commissioned: false,
      submitting: false,
      error: ''
    }
  },
  rma: {
    rmaMode: 'EDIT_DEVICES'
  },
  inventory: {
    bom: [
      { item: 'AC_MODULES', value: '0' },
      { item: 'DC_MODULES', value: '0' },
      { item: 'STRING_INVERTERS', value: '0' },
      { item: 'EXTERNAL_METERS', value: '0' },
      { item: 'ESS', value: '0' }
    ]
  },
  pvs: {
    settingMetadata: false,
    setMetadataStatus: null
  },
  devices: {
    candidates: [
      {
        ISDETAIL: true,
        SERIAL: 'E00121938109605',
        TYPE: 'SOLARBRIDGE',
        STATE: 'working',
        STATEDESCR: 'Has Not Reported',
        MODEL: 'AC_Module_Type_E',
        DESCR: 'Inverter E00121938109605',
        DEVICE_TYPE: 'Inverter',
        SWVER: '4.14.5',
        PORT: '',
        MOD_SN: '',
        NMPLT_SKU: '',
        origin: 'data_logger',
        OPERATION: 'noop',
        CURTIME: '2020,04,20,22,17,23'
      }
    ],
    found: [
      {
        ISDETAIL: true,
        SERIAL: 'E00121938109605',
        TYPE: 'SOLARBRIDGE',
        STATE: 'working',
        STATEDESCR: 'Has Not Reported',
        MODEL: 'AC_Module_Type_E',
        DESCR: 'Inverter E00121938109605',
        DEVICE_TYPE: 'Inverter',
        SWVER: '4.14.5',
        PORT: '',
        MOD_SN: '',
        NMPLT_SKU: '',
        origin: 'data_logger',
        OPERATION: 'noop',
        CURTIME: '2020,04,20,22,17,23'
      }
    ],
    miModels: { E: ['SPR1234', 'SPR5678'] },
    fetchingDevices: false
  }
}

storiesOf('Model Editing Page', module).add('Simple', () => {
  const { store } = configureStore(mockedStore)

  return (
    <div className="full-min-height pt-10 pb-10 pl-15 pr-15">
      <Provider store={store}>
        <ModelEdit />
      </Provider>
    </div>
  )
})
