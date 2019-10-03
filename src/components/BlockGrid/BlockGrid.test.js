import React from 'react'
import { shallow } from 'enzyme'
import BlockGrid from '.'

describe('BlockGrid component', () => {
  it('renders without crashing', () => {
    const component = shallow(<BlockGrid />)
    expect(component).toMatchSnapshot()
  })
})
