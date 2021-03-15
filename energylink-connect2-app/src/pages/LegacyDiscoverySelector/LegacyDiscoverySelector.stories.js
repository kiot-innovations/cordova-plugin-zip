import React from 'react'
import { storiesOf } from '@storybook/react'
import LegacyDiscoverySelector from '.'

storiesOf('Legacy Discovery Settings', module).add('Simple', () => (
  <div className="full-min-height pl-10 pr-10 pt-15 pb-15">
    <LegacyDiscoverySelector />
  </div>
))
