import { storiesOf } from '@storybook/react'
import React from 'react'

import GetAssistance from '.'

storiesOf('GetAssistance Page', module).add('Simple', () => (
  <div className="full-min-height pl-10 pr-10">
    <GetAssistance />
  </div>
))
