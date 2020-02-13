import React from 'react'

import { storiesOf } from '@storybook/react'

import EnergySwitch from './index'

const graphSelect = [
  { id: 1, value: `${'ENERGY'} (kWh)` },
  { id: 2, value: `${'POWER'} (kW)`, selected: true }
]

storiesOf('EnergySwitch', module).add('Simple', () => (
  <EnergySwitch entries={graphSelect} />
))
