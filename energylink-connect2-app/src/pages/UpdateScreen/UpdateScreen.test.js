import React from 'react'

import UpdateScreen from '.'

import * as i18n from 'shared/i18n'

describe('UpdateScreen page', () => {
  const provider = {
    network: {
      connected: false,
      connecting: true
    },
    fileDownloader: {
      progress: {
        progress: 0,
        lastProgress: 0,
        downloading: false,
        fileName: ''
      }
    },
    firmwareUpdate: {
      percent: 100,
      status: 'WAITING_FOR_NETWORK',
      upgrading: true,
      lastSuccessfulStage: 1
    }
  }

  beforeEach(() => {
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key} ${params.join('_')}`.trim()
      )
  })

  test('render correctly', () => {
    const { component } = mountWithProvider(<UpdateScreen />)(provider)
    expect(component).toMatchSnapshot()
  })
})
