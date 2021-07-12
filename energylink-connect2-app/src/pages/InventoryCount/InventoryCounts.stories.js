import { storiesOf } from '@storybook/react'
import React from 'react'

import InventoryCount from '.'

storiesOf('Inventory Count Page', module).add('Simple', () => (
  <div className="full-min-height pl-10 pr-10">
    <InventoryCount />
  </div>
))
