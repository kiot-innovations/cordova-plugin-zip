import React from 'react'
import { storiesOf } from '@storybook/react'
import FirmwareReleaseNotes from '.'

storiesOf('Firmware Release Notes Page', module).add('Simple', () => {
  return (
    <div className="full-min-height pl-10 pr-10">
      <FirmwareReleaseNotes />
    </div>
  )
})
