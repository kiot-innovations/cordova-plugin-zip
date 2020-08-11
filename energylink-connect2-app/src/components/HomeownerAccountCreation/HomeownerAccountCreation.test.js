import React from 'react'
import HomeownerAccountCreation from '.'
import * as reactRedux from 'react-redux'

describe('HomeownerAccountCreation Component', () => {
  beforeEach(() => {
    jest.spyOn(reactRedux, 'useSelector').mockImplementation(jest.fn)
  })

  test('Renders correctly', () => {
    const { component } = mountWithProvider(<HomeownerAccountCreation />)({})
    expect(component).toMatchSnapshot()
  })
})
