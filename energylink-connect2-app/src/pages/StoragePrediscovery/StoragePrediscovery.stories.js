import React from 'react'
import { storiesOf } from '@storybook/react'
import StoragePrediscovery from '.'

storiesOf('Storage - Prediscovery Screen', module).add('Simple', () => (
  <div className="full-min-height">
    <StoragePrediscovery />
  </div>
))
