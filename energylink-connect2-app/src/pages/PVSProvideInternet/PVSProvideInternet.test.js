import React from 'react'
import * as i18n from 'shared/i18n'
import PVSProvideInternet from '.'

describe('PVS Provide Internet page', () => {
  beforeEach(() => {
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(() => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  test('renders correctly', () => {
    const { component } = mountWithProvider(<PVSProvideInternet />)({
      systemConfiguration: {
        network: {
          isConnected: false,
          isFetching: false,
          connectedToAP: { label: '', value: '', ap: null },
          selectedAP: { ssid: '' },
          aps: []
        }
      },
      firmwareUpdate: { canContinue: true }
    })
    expect(component).toMatchSnapshot()
  })
})
