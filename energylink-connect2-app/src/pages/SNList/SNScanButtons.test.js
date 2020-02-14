import React from 'react'
import * as reactRedux from 'react-redux'
import * as i18n from 'shared/i18n'
import SNScanButtons from './SNScanButtons'

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
