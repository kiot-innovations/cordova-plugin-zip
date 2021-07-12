import React from 'react'
import * as reactRedux from 'react-redux'

import StorageWidget from './StorageWidget'

import * as i18n from 'shared/i18n'

describe('Storage Widget', () => {
  let dispatchMock

  let initialState = {
    systemConfiguration: {
      storage: {}
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
    const { component } = mountWithProvider(<StorageWidget />)(initialState)
    expect(component).toMatchSnapshot()
  })
})
