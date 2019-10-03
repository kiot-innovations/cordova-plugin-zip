import React from 'react'
import { shallow } from 'enzyme'
import ScrollableGrid from '.'

describe('ScrollableGrid component', () => {
  it('renders without crashing', () => {
    const component = shallow(<ScrollableGrid />)
    expect(component).toMatchSnapshot()
  })
})
