import React from 'react'
import { storiesOf } from '@storybook/react'
import InventoryCount from '.'

storiesOf('Home Page', module).add('Simple', () => (
  <div className="full-min-height pl-10 pr-10">
    <InventoryCount />
  </div>
))
