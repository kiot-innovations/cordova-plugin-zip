import { storiesOf } from '@storybook/react'
import React from 'react'

import UpdateFirmwareStage from './'

storiesOf('UpdateFirmwareStage', module).add('Simple', () => {
  return (
    <div className="full-min-height pl-10 pr-10">
      <UpdateFirmwareStage stage="Downloading images" percent={100} />
      <UpdateFirmwareStage stage="verifying download" percent={75} />
      <UpdateFirmwareStage stage="decompressing images" percent={0} />
    </div>
  )
})
