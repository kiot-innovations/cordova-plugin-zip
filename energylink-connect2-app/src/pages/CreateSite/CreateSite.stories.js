import React from 'react'
import { storiesOf } from '@storybook/react'
import CreateSite from '.'

storiesOf('CreateSite Page', module).add('Simple', () => (
  <div className="full-min-height pl-10 pr-10">
    <CreateSite />
  </div>
))
