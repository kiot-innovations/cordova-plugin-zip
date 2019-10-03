import React from 'react'
import { shallow } from 'enzyme'
import SwitchButton from '.'

describe('SwitchButton page', () => {
  it('renders without crashing', () => {
    const component = shallow(<SwitchButton />)
    expect(component).toMatchSnapshot()
  })
})
