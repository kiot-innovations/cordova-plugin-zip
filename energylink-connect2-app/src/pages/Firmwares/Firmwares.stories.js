import React from 'react'
import { storiesOf } from '@storybook/react'
import Firmwares from '.'

storiesOf('Firmwares Page', module).add('Simple', () => (
  <div className="full-min-height pl-10 pr-10">
    <Firmwares />
  </div>
))
