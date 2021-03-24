import React from 'react'
import * as reactRedux from 'react-redux'
import * as i18n from 'shared/i18n'
import RSEWidget from './RSEWidget'

describe('RSE Widget', () => {
  let dispatchMock

  let initialState = {
    systemConfiguration: {
      rse: { data: { powerProduction: 'Off' } }
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
})
