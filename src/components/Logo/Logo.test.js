import React from 'react'
import { shallow } from 'enzyme'
import Logo from '.'

describe('Logo component', () => {
  it('renders without crashing', () => {
    const component = shallow(<Logo />)
    expect(component).toMatchSnapshot()
  })
})
