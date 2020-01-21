import React from 'react'
import { storiesOf } from '@storybook/react'
import GiveFeedback from '.'

storiesOf('GiveFeedback Page', module).add('Simple', () => (
  <div className="full-min-height pl-10 pr-10">
    <GiveFeedback />
  </div>
))
