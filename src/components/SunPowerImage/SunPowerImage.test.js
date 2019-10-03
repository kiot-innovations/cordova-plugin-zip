import React from 'react'
import { shallow } from 'enzyme'
import SunPowerImage from '.'

describe('SunPowerImage component', () => {
  it('renders without crashing', () => {
    const component = shallow(<SunPowerImage />)
    expect(component).toMatchSnapshot()
  })
  it('renders the inverse version without crashing', () => {
    const component = shallow(<SunPowerImage inverse={true} />)
    expect(component).toMatchSnapshot()
  })
})
