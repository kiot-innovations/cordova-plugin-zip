import React from 'react'
import { storiesOf } from '@storybook/react'
import Home from '.'

storiesOf('Home Page', module).add('Simple', () => (
  <div className="full-min-height pl-10 pr-10">
    <Home />
  </div>
))
