import React from 'react'
import { storiesOf } from '@storybook/react'
import GiveAssistance from '.'

storiesOf('GiveAssistance Page', module).add('Simple', () => (
  <div className="full-min-height pl-10 pr-10">
    <GiveAssistance />
  </div>
))
