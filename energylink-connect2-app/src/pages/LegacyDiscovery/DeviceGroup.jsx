import React from 'react'
import { length } from 'ramda'
import Collapsible from 'components/Collapsible'
import './LegacyDiscovery.scss'

const DeviceGroup = ({ title, data }) => {
  const deviceList = data.map(device => (
    <span className="mt-5 mb-5 has-text-white">{device.SERIAL}</span>
  ))

  return (
    <Collapsible
      className="mt-10 mb-10 is-flex"
      title={title}
      actions={length(data)}
    >
      {deviceList}
    </Collapsible>
  )
}

export default DeviceGroup
