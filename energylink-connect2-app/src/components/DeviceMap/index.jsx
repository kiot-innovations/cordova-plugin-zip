import React from 'react'
import { useI18n } from 'shared/i18n'
import { is, pluck, head, tail, map, pathOr } from 'ramda'
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

function DeviceMap({ deviceList = defaultDL }) {
  const t = useI18n()
  const headDevice = head(deviceList)
  const restOfDevices = tail(deviceList)

  return (
    <div className="device-map mb-10 mt-10">
      <div className="head-device is-flex">
        <span className="has-text-white has-text-weight-bold is-size-5">
          {t(headDevice.device_type)}
        </span>
        <span className="has-text-weight-bold is-size-5">
          {t(headDevice.serial_number)}
        </span>
      </div>
      <div className="rest-of-devices">
        {map(renderDeviceItem, restOfDevices)}
      </div>
    </div>
  )
}

export default DeviceMap
