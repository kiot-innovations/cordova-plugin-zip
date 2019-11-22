import React from 'react'
import { shallow } from 'enzyme'
import Collapsible from '.'

describe('Collapsible Component', () => {
  test('Renders Correctly', () => {
    const component = shallow(<Collapsible />)
    expect(component).toMatchSnapshot()
  })

  test('Expands Correctly', () => {
    const component = shallow(<Collapsible />)
    component.find('.chevron').simulate('click')
    expect(component.find('.expanded').length).toBe(1)
  })
})
