import { storiesOf } from '@storybook/react'
import React from 'react'

import StatusBox from '.'

const data = {
  text: 'ZT123456789',
  indicator: '50%',
  title: 'Production CT'
}

storiesOf('Statusbox component', module).add('Simple', () => (
  <div className="full-min-height pl-10 pr-10">
    <StatusBox title={data.title} text={data.text} indicator={data.indicator} />
  </div>
))
