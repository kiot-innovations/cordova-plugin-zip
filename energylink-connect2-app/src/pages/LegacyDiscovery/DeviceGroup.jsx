import React from 'react'
import { length, map } from 'ramda'
import { useDispatch, useSelector } from 'react-redux'
import { UPDATE_DEVICES_LIST } from 'state/actions/devices'
import Collapsible from 'components/Collapsible'
import './LegacyDiscovery.scss'

const renderDevice = (
  discoveryComplete,
  removeInverter,
  title
) => deviceItem => (
  <div className="pt-5 pb-5 device-item">
    <span className="mt-5 mb-5 has-text-white">{deviceItem.SERIAL}</span>
    {discoveryComplete && title === 'Inverter' ? (
      <button
        onClick={() => removeInverter(deviceItem.SERIAL)}
        className="has-text-white is-size-6"
      >
        <i className="sp-trash" />
      </button>
    ) : (
      ''
    )}
  </div>
)

const DeviceGroup = ({ title, data, discoveryComplete }) => {
  const dispatch = useDispatch
  const { found } = useSelector(state => state.devices)

  const removeInverter = serial => {
    const filteredDevices = found.filter(device => device.SERIAL !== serial)
    dispatch(UPDATE_DEVICES_LIST(filteredDevices))
  }

  const deviceList = map(
    renderDevice(discoveryComplete, removeInverter, title),
    data
  )

  return (
    <div className="mt-10 mb-10">
      <Collapsible
        className="is-flex flex-column"
        title={title}
        actions={length(data)}
      >
        {deviceList}
      </Collapsible>
    </div>
  )
}

export default DeviceGroup
