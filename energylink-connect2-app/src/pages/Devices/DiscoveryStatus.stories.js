import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import { clone } from 'ramda'
import React from 'react'

import DiscoveryStatus from './DiscoveryStatus'

const okMI = [
  {
    serial_number: 'E00110223232323',
    indicator: 'MI_OK',
    STATEDESCR: 'OK',
    SERIAL: 'E00110223232323'
  },
  {
    serial_number: 'E00110223232324',
    indicator: 'MI_OK',
    STATEDESCR: 'OK',
    SERIAL: 'E00110223232324'
  }
]

const props = {
  discoveryComplete: false,
  error: '',
  expected: 2,
  okMICount: okMI.length,
  errMICount: 0,
  claimError: 0,
  claimingDevices: false,
  claimDevices: action('claim devices'),
  claimProgress: 0,
  retryDiscovery: action('retry discovery')
}

storiesOf('Devices - DiscoveryStatus', module)
  .add('When Discovering', () => {
    return (
      <div className="full-min-height">
        <DiscoveryStatus {...props} />
      </div>
    )
  })
  .add('When discovery complete', () => {
    const p2 = clone(props)
    p2.discoveryComplete = true
    return (
      <div className="full-min-height">
        <DiscoveryStatus {...p2} />
      </div>
    )
  })
  .add('When discovery complete and has errors', () => {
    const p2 = clone(props)
    p2.discoveryComplete = true
    p2.error = 'Something happened with the request'
    return (
      <div className="full-min-height">
        <DiscoveryStatus {...p2} />
      </div>
    )
  })
  .add('When claiming devices', () => {
    const p2 = clone(props)
    p2.claimingDevices = true
    p2.claimProgress = 27
    return (
      <div className="full-min-height">
        <DiscoveryStatus {...p2} />
      </div>
    )
  })
  .add('When claiming has errors', () => {
    const p2 = clone(props)
    p2.claimingDevices = false
    p2.discoveryComplete = true
    p2.claimProgress = 27
    p2.claimError = 'UNK'
    return (
      <div className="full-min-height">
        <DiscoveryStatus {...p2} />
      </div>
    )
  })
