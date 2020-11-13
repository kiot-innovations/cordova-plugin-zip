import React from 'react'
import { storiesOf } from '@storybook/react'
import { configureStore } from 'state/store'
import { Provider } from 'react-redux'

import Permissions from '.'

const permissionsInit = {
  network: {
    checkingPermission: true,
    checkingPermissionError: null
  }
}

const permissionsError = {
  network: {
    checkingPermission: false,
    checkingPermissionError: 'unauthorized'
  }
}

const permissionsSuccess = {
  network: {
    checkingPermission: false,
    checkingPermissionError: null,
    bluetoothAuthorized: true
  }
}

storiesOf('Permissions page', module)
  .add('Simple', () => {
    const { store } = configureStore({})

    return (
      <div className="full-min-height">
        <Provider store={store}>
          <Permissions />
        </Provider>
      </div>
    )
  })
  .add('Requesting permissions', () => {
    const { store } = configureStore(permissionsInit)

    return (
      <div className="full-min-height">
        <Provider store={store}>
          <Permissions />
        </Provider>
      </div>
    )
  })
  .add('Requesting permissions error', () => {
    const { store } = configureStore(permissionsError)

    return (
      <div className="full-min-height">
        <Provider store={store}>
          <Permissions />
        </Provider>
      </div>
    )
  })
  .add('Requesting permissions success', () => {
    const { store } = configureStore(permissionsSuccess)

    return (
      <div className="full-min-height">
        <Provider store={store}>
          <Permissions />
        </Provider>
      </div>
    )
  })
