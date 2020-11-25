import React from 'react'
import { storiesOf } from '@storybook/react'
import VersionInformation from '.'

storiesOf('Version Information Page', module).add('Simple', () => {
  return (
    <div className="full-min-height pl-10 pr-10">
      <VersionInformation />
    </div>
  )
})
