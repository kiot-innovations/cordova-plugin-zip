import React from 'react'
import { storiesOf } from '@storybook/react'
import EQSUpdate from '.'

storiesOf('Storage - FW Update', module).add('Simple', () => (
  <div className="full-min-height">
    <EQSUpdate />
  </div>
))
