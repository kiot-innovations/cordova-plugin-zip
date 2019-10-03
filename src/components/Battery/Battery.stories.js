import React from 'react'

import { storiesOf } from '@storybook/react'

import Battery from '.'

storiesOf('Battery', module)
  .add('Empty', () => <Battery />)
  .add('Half empty', () => <Battery energyPercetage={50} />)
  .add('Full', () => <Battery energyPercetage={100} />)
