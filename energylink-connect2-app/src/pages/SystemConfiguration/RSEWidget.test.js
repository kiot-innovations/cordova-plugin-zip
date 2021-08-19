import React from 'react'
import * as reactRedux from 'react-redux'

import RSEWidget from './RSEWidget'

import * as i18n from 'shared/i18n'

describe('RSE Widget', () => {
  let dispatchMock

  let initialState = {
    systemConfiguration: {
      rse: { data: { powerProduction: 'Off' } }
    },
    stringInverters: {
      newDevices: []
    }
  }

  beforeEach(() => {
    dispatchMock = jest.fn()
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatchMock)
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key = '', ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  test('renders correctly', () => {
    const { component } = mountWithProvider(<RSEWidget />)(initialState)
    expect(component).toMatchSnapshot()
  })

  test('disabled if string inverters are present', () => {
    const store = {
      systemConfiguration: {
        rse: { data: { powerProduction: 'Off' } }
      },
      stringInverters: {
        newDevices: [{ SERIAL: '0000001' }]
      }
    }

    const { component } = mountWithProvider(<RSEWidget />)(store)
    expect(component.find('#rse-not-available').length).toBe(1)
  })
})
