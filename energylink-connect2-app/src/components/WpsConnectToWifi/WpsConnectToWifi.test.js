import React from 'react'
import * as reactRedux from 'react-redux'

import WpsConnectToWifi from '.'

describe('WpsConnectToWifi Component', () => {
  beforeEach(() => {
    jest.spyOn(reactRedux, 'useSelector').mockImplementation(jest.fn)
  })

  test('Renders correctly', () => {
    const { component } = mountWithProvider(<WpsConnectToWifi />)({})
    expect(component).toMatchSnapshot()
  })
})
