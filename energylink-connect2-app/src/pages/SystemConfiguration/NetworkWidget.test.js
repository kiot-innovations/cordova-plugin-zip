import React from 'react'
import * as reactRedux from 'react-redux'
import * as i18n from 'shared/i18n'
import NetworkWidget from './NetworkWidget'

describe('Network Widget', () => {
  let dispatchMock

  let initialState = {
    systemConfiguration: {
      network: {
        aps: [{ ssid: '1' }, { ssid: '2' }],
        selectedAP: { label: '' },
        connectedToAP: { label: '', value: '', ap: { ssid: '' } },
        error: null
      }
    }
  }

  beforeEach(() => {
    dispatchMock = jest.fn()
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatchMock)
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  test('renders correctly', () => {
    const { component } = mountWithProvider(<NetworkWidget />)(initialState)
    expect(component).toMatchSnapshot()
  })
})
