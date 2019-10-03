import React from 'react'
import { shallow } from 'enzyme'
import EnergyInfo from '.'
import { HomeWhite } from '../Icons'

describe('EnergyInfo Component', () => {
  it('renders without crashing', () => {
    const home = {
      title: 'Home',
      text: 'Consumption',
      when: 'today',
      value: 10.3,
      unit: 'kWh',
      color: 'white',
      icon: <HomeWhite />
    }

    const component = shallow(<EnergyInfo {...home} />)
    expect(component).toMatchSnapshot()
  })
})
