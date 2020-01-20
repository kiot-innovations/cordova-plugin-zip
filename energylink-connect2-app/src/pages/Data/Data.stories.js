import React from 'react'
import { storiesOf } from '@storybook/react'
import Data from '.'

storiesOf('Data', module).add('Simple', () => (
  <div className="full-min-height pl-10 pr-10">
    <Data />
  </div>
))
