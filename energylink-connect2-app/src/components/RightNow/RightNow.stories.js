import React from 'react'

import { storiesOf } from '@storybook/react'

import RightNow from './index'

storiesOf('RightNow', module).add('Simple', () => <RightNow solarAvailable />)

storiesOf('RightNow', module).add('No solar', () => (
  <RightNow
    solarAvailable={false}
    hasStorage
    batteryLevel={60}
    gridValue={9}
    homeValue={10}
    storageValue={1}
  />
))

storiesOf('RightNow', module).add('No solar', () => (
  <RightNow
    solarAvailable={false}
    hasStorage
    batteryLevel={60}
    gridValue={9}
    homeValue={10}
    storageValue={1}
  />
))
storiesOf('RightNow', module).add('No battery', () => (
  <RightNow
    solarAvailable
    gridValue={9}
    homeValue={10}
    storageValue={1}
    solarValue={1}
  />
))
