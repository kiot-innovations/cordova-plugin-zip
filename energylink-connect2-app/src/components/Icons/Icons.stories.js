import { storiesOf } from '@storybook/react'
import React from 'react'

import * as Icons from './index'

Object.entries(Icons).forEach(([key, IconComponent]) => {
  storiesOf('Icons', module).add(key, () => <IconComponent />)
})
