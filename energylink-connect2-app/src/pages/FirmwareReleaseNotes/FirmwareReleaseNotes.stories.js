import React from 'react'
import { storiesOf } from '@storybook/react'
import { Provider } from 'react-redux'
import { configureStore } from 'state/store'

import FirmwareReleaseNotes from '.'

const mockedStore = {
  firmwareUpdate: {
    releaseNotes: {
      meta: {
        version: '1.0.0',
        description: 'This file contains the release notes for PVS firmware'
      },
      versions: [
        {
          versionNumber: 'Release 8616',
          releaseDate: '2020-11-05',
          bodyMarkdown:
            '# Features\n- SunVault ready\n- Full support for Pro Connect app'
        },
        {
          versionNumber: 'Release 6415',
          releaseDate: '2020-10-01',
          bodyMarkdown:
            '# Improvements\n- Bulletproof protection against interference from nearby Envoys\nRobust microinverter firmware upgrade'
        },
        {
          versionNumber: 'Release 6410',
          releaseDate: '2020-10-01',
          bodyMarkdown:
            '# Improvements\n- Bulletproof protection against interference from nearby Envoys\nRobust microinverter firmware upgrade'
        }
      ]
    }
  }
}

storiesOf('Firmware Release Notes Page', module).add('Simple', () => {
  const { store } = configureStore(mockedStore)

  return (
    <div className="full-min-height pl-10 pr-10">
      <Provider store={store}>
        <FirmwareReleaseNotes />
      </Provider>
    </div>
  )
})
