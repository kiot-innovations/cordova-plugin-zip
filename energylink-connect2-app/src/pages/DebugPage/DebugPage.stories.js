import React from 'react'
import { storiesOf } from '@storybook/react'
import DebugPage from '.'

storiesOf('Debug Page', module).add('Simple', () => (
  <div className="full-min-height">
    <DebugPage />
  </div>
))
