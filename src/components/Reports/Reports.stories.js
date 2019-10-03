import React from 'react'

import { storiesOf } from '@storybook/react'

import Reports from './index'

storiesOf('Reports', module).add('Simple', () => (
  <div className="has-background-white">
    <Reports />
  </div>
))
