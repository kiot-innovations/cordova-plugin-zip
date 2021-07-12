import { is, pluck, head, map, pathOr } from 'ramda'
import React from 'react'
import './DeviceMap.scss'

const renderDeviceItem = device => {
  if (is(Array, device)) {
    const serialNumbers = pluck('serial_number', device)
    const device_type = pathOr(
      'DEVICE_MAPPING_UNKNOWN_DEVICE',
      ['device_type'],
      head(device)
    )

    return (
      <div className="mt-5 mb-5 is-flex child-device" key={device_type}>
        <span className="has-text-white has-text-weight-bold">
          {device_type}
        </span>
        {serialNumbers.filter(Boolean).map((sn, i) => (
          <span className="has-text-weight-bold" key={sn + i}>
            {sn}
          </span>
        ))}
      </div>
    )
  }

  return (
    <div
      className="mt-5 mb-5 is-flex child-device"
      key={device.serial_number + device.device_type}
    >
      <span className="has-text-white has-text-weight-bold">
        {device.device_type}
      </span>
      <span className="has-text-weight-bold">{device.serial_number}</span>
    </div>
  )
}

const defaultDL = [
  {
    device_type: 'NO_DEVICEMAP',
    serial_number: 'DEVICEMAP_ERROR'
  }
]

function DeviceMap({ deviceList = defaultDL, title = '' }) {
  return (
    <div className="device-map mb-10 mt-10">
      <div className="head-device is-flex">
        <h1 className="has-text-white has-text-weight-bold is-size-5 mb-10">
          {title}
        </h1>
      </div>
      <div className="rest-of-devices">{map(renderDeviceItem, deviceList)}</div>
    </div>
  )
}

export default DeviceMap
