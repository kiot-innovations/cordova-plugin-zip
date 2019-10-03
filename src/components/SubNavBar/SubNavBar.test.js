import React from 'react'
import { shallow } from 'enzyme'
import SubNavBar from '.'

describe('SubNavBar component', () => {
  it('renders without crashing', () => {
    const component = shallow(<SubNavBar />)
    expect(component).toMatchSnapshot()
  })
})
