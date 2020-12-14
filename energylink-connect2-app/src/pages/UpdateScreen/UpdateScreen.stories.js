import React from 'react'
import { storiesOf } from '@storybook/react'
import UpdateScreen from '.'
import { configureStore } from 'state/store'
import { Provider } from 'react-redux'

const progressStore = {
  firmwareUpdate: {
    canContinue: true,
    percent: 100,
    status: 'WAITING_FOR_NETWORK',
    upgrading: true,
    versionBeforeUpgrade: 8103
  },
  fileDownloader: {
    fileInfo: {
      displayName: 'staging prod cylon - 8127',
      error: '',
      exists: true,
      lastModified: 1600451662000,
      name: 'firmware/staging-prod-cylon-8127.fs',
      size: '35.14',
      step: 'UPDATING_URL',
      updateURL:
        'https://fw-assets-pvs6-dev.dev-edp.sunpower.com/staging-prod-cylon/8127/fwup/fwup.lua'
    },
    progress: {
      downloading: true,
      progress: 100
    }
  }
}
const errorStore = {
  firmwareUpdate: {
    status: 'error'
  },
  fileDownloader: {
    fileInfo: {
      displayName: 'staging prod cylon - 8127',
      error: '',
      exists: true,
      lastModified: 1600451662000,
      name: 'firmware/staging-prod-cylon-8127.fs',
      size: '35.14',
      step: 'UPDATING_URL',
      updateURL:
        'https://fw-assets-pvs6-dev.dev-edp.sunpower.com/staging-prod-cylon/8127/fwup/fwup.lua'
    },
    progress: {
      downloading: true,
      progress: 100
    }
  }
}
storiesOf('Update PVS Page', module)
  .add('Simple', () => {
    const { store } = configureStore(progressStore, false)
    return (
      <div className="full-min-height pl-10 pr-10">
        <Provider store={store}>
          <UpdateScreen />
        </Provider>
      </div>
    )
  })
  .add('Error', () => {
    const { store } = configureStore(errorStore)
    return (
      <div className="full-min-height pl-10 pr-10">
        <Provider store={store}>
          <UpdateScreen />
        </Provider>
      </div>
    )
  })
