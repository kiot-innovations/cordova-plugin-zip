import { storiesOf } from '@storybook/react'
import React, { useState } from 'react'

import StringInverter from '.'

function StringInverterComponent() {
  const [device, setDevice] = useState({
    MODEL: 'SMA-SB3.8-1SP-US-40',
    SERIAL: '0142142142'
  })

  const updateDevice = (index, info) => setDevice(info)

  return (
    <div className="column">
      <StringInverter device={device} updateDevice={updateDevice} />
    </div>
  )
}

storiesOf('StringInverter', module).add('Simple', () => (
  <StringInverterComponent />
))
