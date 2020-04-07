import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './LegacyDiscovery.scss'
import { FETCH_CANDIDATES_COMPLETE } from 'state/actions/devices'
import { groupBy, prop, length } from 'ramda'
import DeviceGroup from './DeviceGroup'

const LegacyDiscovery = ({ animationState }) => {
  const { found } = useSelector(state => state.devices)
  const dispatch = useDispatch()

  useEffect(() => {
    if (animationState === 'enter') {
      dispatch(FETCH_CANDIDATES_COMPLETE())
    }
  })
  const groupedDevices =
    length(found) > 0 ? groupBy(prop('DEVICE_TYPE'))(found) : []

  return (
    <div className="fill-parent has-text-centered pr-15 pl-15">
      <span className="is-uppercase has-text-weight-bold mb-20">
        Legacy Discovery
      </span>
      {Object.keys(groupedDevices).map((key, i) => (
        <DeviceGroup title={key} data={groupedDevices[key]} />
      ))}
    </div>
  )
}

export default LegacyDiscovery
