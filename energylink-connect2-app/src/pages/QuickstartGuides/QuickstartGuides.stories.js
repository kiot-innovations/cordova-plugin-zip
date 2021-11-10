import { storiesOf } from '@storybook/react'
import React from 'react'

import QuickstartGuides from '.'

storiesOf('QuickstartGuides Page', module).add('Main', () => {
  return (
    <div className="full-min-height pl-10 pr-10">
      <QuickstartGuides />
    </div>
  )
})
