import React from 'react'

import { storiesOf } from '@storybook/react'

import BatteryMode from './index'

storiesOf('BatteryMode', module).add('Simple', () => (
  <BatteryMode mode="charging" />
))
