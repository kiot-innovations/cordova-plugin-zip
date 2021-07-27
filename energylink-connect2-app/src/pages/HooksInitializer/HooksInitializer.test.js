import React from 'react'
import HooksInitializer from '.'
import * as i18n from 'shared/i18n'

describe('HooksInitializer page', () => {
  const provider = {
    global: {
      updateAvailable: true,
      updateVersion: 0
    },
    firmwareUpdate: {
      status: 'WAITING_FOR_NETWORK',
      upgrading: true
    },
    user: {
      isAuthenticating: false
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
    const component = mountWithProvider(<HooksInitializer />)(provider)
    expect(component).toMatchSnapshot()
  })
})
