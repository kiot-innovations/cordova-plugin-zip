import React from 'react'
import ConnectToPVS from '.'
import * as i18n from 'shared/i18n'
import * as reactRedux from 'react-redux'

describe('Connect to PVS page', () => {
  let dispatchMock
  let storeMock = {
    network: {
      connectionState: {
        connected: false,
        connecting: false,
        err: ''
      }
    }
  }
  beforeEach(() => {
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
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  test('render correctly', () => {
    const { component } = mountWithProvider(<ConnectToPVS />)(storeMock)
    expect(component).toMatchSnapshot()
  })
})
