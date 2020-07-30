import React from 'react'
import { storiesOf } from '@storybook/react'
import ConnectToPVS from '.'

storiesOf('Connect to PVS', module).add('Simple', () => (
  <div className="full-min-height pl-10 pr-10">
    <ConnectToPVS />
  </div>
))