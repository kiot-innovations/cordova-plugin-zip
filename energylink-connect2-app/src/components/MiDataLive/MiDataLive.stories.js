import React from 'react'
import { storiesOf } from '@storybook/react'

import MiDataLive from '.'

const data = [
  {
    sn: 'E00121837000376',
    power: 360
  },
  {
    sn: 'E00121836037707',
    power: 360.56
  },
  {
    sn: 'E00121837000376',
    power: 360.567
  },
  {
    sn: 'E00121836037707',
    power: 360.5678
  }
]

storiesOf('MiDataLive', module).add('With data', () => (
  <div className="full-min-height">
    <MiDataLive data={data} />
  </div>
))
