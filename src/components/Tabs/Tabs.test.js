import React from 'react'
import { shallow } from 'enzyme'
import Tabs from '.'

describe('Tabs component', () => {
  it('renders without crashing', () => {
    const component = shallow(<Tabs />)
    expect(component).toMatchSnapshot()
  })
})
