import { storiesOf } from '@storybook/react'
import React from 'react'
import { Provider } from 'react-redux'

import { appConnectionStatus } from '../../state/reducers/network'

import { Header } from '.'

import { configureStore } from 'state/store'

const noAddressNotConnected = {
  firmwareUpdate: {
    upgrading: false,
    status: '',
    percent: 0
  },
  ui: {
    menu: {
      show: false,
      itemToDisplay: '',
      previousUrl: ''
    }
  },
  site: {
    site: {
      address1: ''
    }
  },
  network: {
    connectionStatus: appConnectionStatus.NOT_CONNECTED
  }
}

const addressConnected = {
  firmwareUpdate: {
    upgrading: false,
    status: '',
    percent: 0
  },
  ui: {
    menu: {
      show: false,
      itemToDisplay: '',
      previousUrl: ''
    }
  },
  site: {
    site: {
      address1: '555 Home Street, San Jose, California'
    }
  },
  network: {
    connectionStatus: appConnectionStatus.CONNECTED
  }
}

const addressNotConnected = {
  firmwareUpdate: {
    upgrading: false,
    status: '',
    percent: 0
  },
  ui: {
    menu: {
      show: false,
      itemToDisplay: '',
      previousUrl: ''
    }
  },
  site: {
    site: {
      address1: '555 Home Street, San Jose, California'
    }
  },
  network: {
    connectionStatus: appConnectionStatus.NOT_USING_WIFI
  }
}

storiesOf('Header', module)
  .add('Simple', () => {
    const { store } = configureStore(noAddressNotConnected)
    return (
      <Provider store={store}>
        <Header />
      </Provider>
    )
  })
  .add('Address, Connected', () => {
    const { store } = configureStore(addressConnected)
    return (
      <Provider store={store}>
        <Header />
      </Provider>
    )
  })
  .add('Address, Not Connected', () => {
    const { store } = configureStore(addressNotConnected)
    return (
      <Provider store={store}>
        <Header />
      </Provider>
    )
  })
