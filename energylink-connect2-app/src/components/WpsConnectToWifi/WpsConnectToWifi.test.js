import React from 'react'
import WpsConnectToWifi from '.'
import * as reactRedux from 'react-redux'

describe('WpsConnectToWifi Component', () => {
  beforeEach(() => {
    jest.spyOn(reactRedux, 'useSelector').mockImplementation(jest.fn)
  })

  test('Renders correctly', () => {
    const { component } = mountWithProvider(<WpsConnectToWifi />)({})
    expect(component).toMatchSnapshot()
  })
})
