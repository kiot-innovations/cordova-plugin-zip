import React from 'react'
import moment from 'moment'
import { storiesOf } from '@storybook/react'

import EnergyInfo from './index'
import { HomeGray, HomeWhite, SolarPanel, Grid, Battery, Arrow } from '../Icons'

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

const date = moment()
const only = date.format('MMM, MM/DD/YY,')
const hour = date.format('h:mm') + ' hrs'

const outage = {
  title: only,
  text: hour,
  when: '3h 21m',
  value: '5.7',
  unit: 'kWh',
  color: 'primary',
  high: true,
  icon: (
    <div className="is-flex level pr-10">
      <Battery />
      <div className="ml-10 mr-10">
        <Arrow />
      </div>
      <HomeGray />
    </div>
  )
}

storiesOf('EnergyInfo', module)
  .add('Home', () => (
    <div className="ml-10 mt-10 mr-10 mb-10">
      <EnergyInfo {...home} />
    </div>
  ))
  .add('Solar', () => (
    <div className="ml-10 mt-10 mr-10 mb-10">
      <EnergyInfo {...solar} />
    </div>
  ))
  .add('Grid', () => (
    <div className="ml-10 mt-10 mr-10 mb-10">
      <EnergyInfo {...grid} />
    </div>
  ))
  .add('Battery', () => (
    <div className="ml-10 mt-10 mr-10 mb-10">
      <EnergyInfo {...battery} />
    </div>
  ))
  .add('Energy Outage', () => (
    <div className="ml-10 mt-10 mr-10 mb-10">
      <EnergyInfo {...outage} />
    </div>
  ))
