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
    power: 360
  },
  {
    sn: 'E00121837000376',
    power: 360
  },
  {
    sn: 'E00121836037707',
    power: 360
  }
]

storiesOf('MiDataLive', module).add('With data', () => (
  <div className="full-min-height">
    <MiDataLive data={data} />
  </div>
))
