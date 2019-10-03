import React from 'react'
import { shallow } from 'enzyme'
import BlockItem from '.'

describe('BlockItem component', () => {
  it('renders without crashing', () => {
    const component = shallow(<BlockItem />)
    expect(component).toMatchSnapshot()
  })
})
