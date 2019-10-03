import React from 'react'
import { shallow } from 'enzyme'

import EnergyInfoGroup from '.'
import { HomeWhite, SolarPanel, Grid, Battery } from '../Icons'

describe('EnergyInfoGroup Component', () => {
  it('renders without crashing', () => {
    const home = {
      title: 'Home',
      text: 'Consumption',
      when: 'today',
      value: '10.3',
      unit: 'kWh',
      color: 'white',
      icon: <HomeWhite />
    }

    const solar = {
      title: 'Solar',
      text: 'Production',
      when: 'today',
      value: '5.0',
      unit: 'kWh',
      color: 'warning',
      icon: <SolarPanel />
    }

    const grid = {
      title: 'Grid',
      text: 'Usage',
      when: 'today',
      value: '2.3',
      unit: 'kWh',
      color: 'info',
      icon: <Grid />
    }

    const battery = {
      title: 'Battery',
      text: 'Charged',
      when: 'today',
      value: '3.0',
      unit: 'kWh',
      color: 'primary',
      icon: <Battery />
    }

    const data = [home, solar, grid, battery]

    const component = shallow(<EnergyInfoGroup data={data} />)
    expect(component).toMatchSnapshot()
  })
})
