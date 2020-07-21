import React from 'react'
import Header from '.'
import * as reactRedux from 'react-redux'

describe('Header Component', () => {
  beforeEach(() => {
    jest.spyOn(reactRedux, 'useSelector').mockImplementation(jest.fn)
  })
  test('Renders correctly', () => {
    const { component } = mountWithProvider(<Header />)({})
    expect(component).toMatchSnapshot()
  })

  test('Renders text instead of logo', () => {
    const { component } = mountWithProvider(<Header text="ADDRESS" />)({})
    expect(component.find('.text').text()).toBe('ADDRESS')
    expect(component).toMatchSnapshot()
  })
})
