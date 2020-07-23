import React from 'react'
import * as reactRedux from 'react-redux'
import * as i18n from 'shared/i18n'
import SNManualEntry from './SNManualEntry'

describe('SNManualEntry', () => {
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
    const { component } = mountWithProvider(<SNManualEntry serialNumber="" />)()
    expect(component).toMatchSnapshot()
  })

  test('renders correctly when editing a serial number', () => {
    const { component } = mountWithProvider(
      <SNManualEntry serialNumber="123456789123" />
    )()
    expect(component).toMatchSnapshot()
  })
})
