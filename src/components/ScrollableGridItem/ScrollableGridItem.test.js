import React from 'react'
import { shallow } from 'enzyme'
import ScrollableGridItem from '.'

describe('ScrollableGridItem component', () => {
  it('renders without crashing', () => {
    const component = shallow(<ScrollableGridItem />)
    expect(component).toMatchSnapshot()
  })
})
