import React from 'react'
import Permissions from '.'
import * as i18n from 'shared/i18n'
import * as reactRedux from 'react-redux'

describe('Permissions page', () => {
  let dispatchMock
  let storeMock = {
    network: {
      bluetoothAuthorization: false
    }
  }
  beforeEach(() => {
    dispatchMock = jest.fn()
    global.alert = jest.fn()
    jest.mock('react-router-dom', () => ({
      useHistory: () => ({
        history: {
          push: jest.fn()
        }
      })
    }))

    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatchMock)
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key} ${params.join('_')}`.trim()
      )
  })

  test('render correctly', () => {
    const { component } = mountWithProvider(<Permissions />)(storeMock)
    expect(component).toMatchSnapshot()
  })
})
