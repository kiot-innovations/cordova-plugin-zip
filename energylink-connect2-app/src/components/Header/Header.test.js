import React from 'react'
import { shallow } from 'enzyme'
import Header from '.'
import * as reactRedux from 'react-redux'

describe('Header Component', () => {
  beforeEach(() => {
    jest.spyOn(reactRedux, 'useSelector').mockImplementation(jest.fn)
  })
  test('Renders correctly', () => {
    const component = shallow(<Header />)
    expect(component.html()).toMatchSnapshot()
  })

  test('Renders text instead of logo', () => {
    const component = shallow(<Header text="ADDRESS" />)
    expect(component.find('.text').text()).toBe('ADDRESS')
    expect(component.html()).toMatchSnapshot()
  })
})
