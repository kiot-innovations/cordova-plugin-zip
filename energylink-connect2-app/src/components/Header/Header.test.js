import React from 'react'
import { shallow } from 'enzyme'
import Header from '.'

describe('Header Component', () => {
  test('Renders correctly', () => {
    const component = shallow(<Header />)
    expect(component).toMatchSnapshot()
  })

  test('Renders text instead of logo', () => {
    const component = shallow(<Header text="ADDRESS" />)
    expect(component.find('.text').text()).toBe('ADDRESS')
    expect(component).toMatchSnapshot()
  })
})
