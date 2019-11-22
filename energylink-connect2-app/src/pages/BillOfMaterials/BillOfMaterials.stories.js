import React from 'react'
import { storiesOf } from '@storybook/react'
import BillOfMaterials from '.'

storiesOf('BillOfMaterials Page', module).add('Simple', () => (
  <div className="full-min-height pl-10 pr-10">
    <BillOfMaterials />
  </div>
))
