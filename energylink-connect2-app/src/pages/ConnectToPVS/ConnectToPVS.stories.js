import { storiesOf } from '@storybook/react'
import { assocPath } from 'ramda'
import React from 'react'
import { Provider } from 'react-redux'

import ConnectToPVS from '.'

import { configureStore } from 'state/store'

const cs = {
  network: {
    connecting: true,
    connected: false,
    showEnablingAccessPoint: false,
    bluetoothEnabled: true
  },
  pvs: {
    serialNumber: 'ZT00152000381'
  },
  rma: {
    rmaMode: ''
  }
}

const csc = assocPath(['network', 'showEnablingAccessPoint'], true, cs)
const step1 = assocPath(
  ['network', 'bluetoothStatus'],
  'DISCOVERING_PVS_BLE',
  csc
)
const step2 = assocPath(
  ['network', 'bluetoothStatus'],
  'CONNECTING_PVS_VIA_BLE',
  csc
)
const step3 = assocPath(
  ['network', 'bluetoothStatus'],
  'ENABLING_ACCESS_POINT_ON_PVS',
  csc
)
const step4 = assocPath(
  ['network', 'bluetoothStatus'],
  'ENABLED_ACCESS_POINT_ON_PVS',
  csc
)
const step5 = {
  ...assocPath(
    ['network', 'bluetoothStatus'],
    'FAILED_ACCESS_POINT_ON_PVS',
    csc
  )
}

step5.network.connecting = false

storiesOf('Connect to PVS', module)
  .add('Simple', () => (
    <div className="full-min-height pl-10 pr-10">
      <ConnectToPVS />
    </div>
  ))
  .add('Connecting', () => {
    const { store } = configureStore(cs)
    return (
      <div className="full-min-height pl-10 pr-10">
        <Provider store={store}>
          <ConnectToPVS />
        </Provider>
      </div>
    )
  })
  .add('Delayed connection', () => {
    const { store } = configureStore(csc)
    return (
      <div className="full-min-height pl-10 pr-10">
        <Provider store={store}>
          <ConnectToPVS />
        </Provider>
      </div>
    )
  })
  .add('Bluetooth scanning devices', () => {
    const { store } = configureStore(step1)
    return (
      <div className="full-min-height pl-10 pr-10">
        <Provider store={store}>
          <ConnectToPVS />
        </Provider>
      </div>
    )
  })
  .add('Bluetooth connecting via BLE', () => {
    const { store } = configureStore(step2)
    return (
      <div className="full-min-height pl-10 pr-10">
        <Provider store={store}>
          <ConnectToPVS />
        </Provider>
      </div>
    )
  })
  .add('Bluetooth enabling WIFI via BLE', () => {
    const { store } = configureStore(step3)
    return (
      <div className="full-min-height pl-10 pr-10">
        <Provider store={store}>
          <ConnectToPVS />
        </Provider>
      </div>
    )
  })
  .add('Bluetooth Enabled WIFI via BLE', () => {
    const { store } = configureStore(step4)
    return (
      <div className="full-min-height pl-10 pr-10">
        <Provider store={store}>
          <ConnectToPVS />
        </Provider>
      </div>
    )
  })
  .add('Bluetooth FAILED connecting via BLE', () => {
    const { store } = configureStore(step5)
    return (
      <div className="full-min-height pl-10 pr-10">
        <Provider store={store}>
          <ConnectToPVS />
        </Provider>
      </div>
    )
  })
