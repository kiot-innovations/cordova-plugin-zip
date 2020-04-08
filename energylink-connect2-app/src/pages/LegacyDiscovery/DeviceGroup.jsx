import React from 'react'
import { length } from 'ramda'
import { useDispatch, useSelector } from 'react-redux'
import { UPDATE_DEVICES_LIST } from 'state/actions/devices'
import Collapsible from 'components/Collapsible'
import './LegacyDiscovery.scss'

const DeviceGroup = ({ title, data, discoveryComplete }) => {
  const dispatch = useDispatch
  const { found } = useSelector(state => state.devices)

  const removeInverter = serial => {
    alert('Removing inverter', serial)
    const foundCopy = found
    const filteredDevices = foundCopy.filter(device => device.SERIAL !== serial)
    dispatch(UPDATE_DEVICES_LIST(filteredDevices))
  }

  const deviceList = data.map(device => (
    <div className="pt-5 pb-5 device-item">
      <span className="mt-5 mb-5 has-text-white">{device.SERIAL}</span>
      {discoveryComplete === true && title === 'Inverter' ? (
        <button
          onClick={() => removeInverter(device.SERIAL)}
          className="has-text-white is-size-6"
        >
          <i className="sp-trash" />
        </button>
      ) : (
        ''
      )}
    </div>
  ))

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
