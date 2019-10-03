import React from 'react'

import { storiesOf } from '@storybook/react'

import EnergyInfoGroup from '.'
import { HomeWhite, SolarPanel, Grid, Battery } from '../Icons'

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
const title = 'Self-Reliant'
const percent = 80
storiesOf('EnergyInfoGroup', module).add('Simple', () => (
  <div className="mt-10 mr-10 mb-10 ml-10">
    <EnergyInfoGroup data={data} title={title} percent={percent} />
  </div>
))
