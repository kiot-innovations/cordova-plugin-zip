import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { filter, pathOr, startsWith } from 'ramda'
import {
  BLE_GET_DEVICES,
  CONNECT_PVS_VIA_BLE,
  SET_SSID,
  SET_AP_PWD
} from 'state/actions/network'
import NearbyPVSUI from './NearbyPVSUI'
import { generatePassword, generateSSID, getBLEPath } from 'shared/utils'
import paths from 'routes/paths'

const isPVS = device => startsWith('ZT', pathOr('', getBLEPath(), device))

function NearbyPVS() {
  const dispatch = useDispatch()
  const history = useHistory()

  const {
    bleSearching,
    nearbyDevices,
    bluetoothStatus,
    err,
    connected
  } = useSelector(state => state.network)
  const [connecting, setConnecting] = useState(false)
  const nearbyPVS = filter(isPVS, nearbyDevices)

  const retrySearch = () => {
    dispatch(BLE_GET_DEVICES())
  }

  const connectToPVS = device => {
    setConnecting(true)
    const ssid = generateSSID(device.name)
    const password = generatePassword(device.name)
    dispatch(SET_SSID(ssid))
    dispatch(SET_AP_PWD(password))
    dispatch(CONNECT_PVS_VIA_BLE(device))
  }

  const dismissModal = () => setConnecting(false)

  const continueCommissioning = () => {
    setConnecting(false)
    history.push(paths.PROTECTED.PVS_PROVIDE_INTERNET.path)
  }

  useEffect(() => {
    if (connected) setConnecting(false)
  }, [connected])

  useEffect(() => {
    dispatch(BLE_GET_DEVICES())
  }, [dispatch])

  return (
    <NearbyPVSUI
      bleSearching={bleSearching}
      retrySearch={retrySearch}
      devices={nearbyPVS}
      connectToPVS={connectToPVS}
      connecting={connecting}
      dismissModal={dismissModal}
      connected={connected}
      bleStatus={bluetoothStatus}
      wifiError={err}
      continueCommissioning={continueCommissioning}
    />
  )
}

export default NearbyPVS
