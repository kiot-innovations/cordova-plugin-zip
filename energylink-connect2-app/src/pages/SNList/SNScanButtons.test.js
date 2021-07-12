import React from 'react'
import * as reactRedux from 'react-redux'

import SNScanButtons from './SNScanButtons'

import * as i18n from 'shared/i18n'

describe('SNScanButtons', () => {
  let dispatchMock

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
    const { component } = mountWithProvider(<SNScanButtons />)()
    expect(component).toMatchSnapshot()
  })
})
