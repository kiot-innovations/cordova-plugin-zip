import React from 'react'
import { storiesOf } from '@storybook/react'
import StorageSyncFooter from './StorageSyncFooter'

const buttonClick = () => alert('Button Clicked')

storiesOf('Storage Sync Footer', module)
  .add('Action Pending', () => (
    <div className="full-min-height pl-10 pr-10 pt-10 pb-10">
      <StorageSyncFooter
        sync={buttonClick}
        clear={buttonClick}
        submitting={false}
        error={false}
        commissioned={false}
      />
    </div>
  ))
  .add('Sync Started', () => (
    <div className="full-min-height pl-10 pr-10 pt-10 pb-10">
      <StorageSyncFooter
        sync={buttonClick}
        clear={buttonClick}
        submitting={true}
        error={false}
        commissioned={false}
      />
    </div>
  ))
  .add('Sync Failed', () => (
    <div className="full-min-height pl-10 pr-10 pt-10 pb-10">
      <StorageSyncFooter
        sync={buttonClick}
        clear={buttonClick}
        submitting={false}
        error={true}
        commissioned={false}
      />
    </div>
  ))
  .add('Sync Successful', () => (
    <div className="full-min-height pl-10 pr-10 pt-10 pb-10">
      <StorageSyncFooter
        sync={buttonClick}
        clear={buttonClick}
        submitting={false}
        error={false}
        commissioned={true}
      />
    </div>
  ))
