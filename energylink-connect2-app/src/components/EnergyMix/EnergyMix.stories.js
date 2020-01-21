import React from 'react'

import { storiesOf } from '@storybook/react'

import EnergyMix from './index'

storiesOf('EnergyMix', module).add('Simple', () => (
  <EnergyMix
    data={{
      date: new Date(2019, 9, 9, 12, 0, 0),
      solar: 2.3,
      storage: 1,
      grid: 1,
      homeUsage: 4.3
    }}
  />
))
