import React from 'react'
import * as reactRedux from 'react-redux'

import HomeownerAccountCreation from '.'

describe('HomeownerAccountCreation Component', () => {
  beforeEach(() => {
    jest.spyOn(reactRedux, 'useSelector').mockImplementation(jest.fn)
  })

  test('Renders correctly', () => {
    const { component } = mountWithProvider(<HomeownerAccountCreation />)({})
    expect(component).toMatchSnapshot()
  })
})
