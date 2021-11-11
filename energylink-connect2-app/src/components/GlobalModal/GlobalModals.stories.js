import { storiesOf } from '@storybook/react'
import React from 'react'

import ForceStorageFlowModal from './ForceStorageAfterPVSFWUP'

storiesOf('Global Modals', module).add('Force Storage after a PVS FWUP', () => {
  return (
    <div className="full-min-height pl-10 pr-10 pt-50">
      <ForceStorageFlowModal />
    </div>
  )
})
