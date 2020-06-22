import React from 'react'
import { head, remove } from 'ramda'
import './DeviceMap.scss'

const deviceItem = device => (
  <div className="mt-5 mb-5 is-flex child-device">
    <span className="has-text-white has-text-weight-bold">
      {device.device_type}
    </span>
    <span className="has-text-weight-bold">{device.serial_number}</span>
  </div>
)

function DeviceMap({ deviceList }) {
  const headDevice = head(deviceList)
  const restOfDevices = remove(0, 1, deviceList)

  return (
    <div className="device-map mb-10 mt-10">
      <div className="head-device is-flex">
        <span className="has-text-white has-text-weight-bold is-size-5">
          {headDevice.device_type}
        </span>
        <span className="has-text-weight-bold is-size-5">
          {headDevice.serial_number}
        </span>
      </div>
      <div className="rest-of-devices">
        {restOfDevices.map(device => deviceItem(device))}
      </div>
    </div>
  )
}

export default DeviceMap
