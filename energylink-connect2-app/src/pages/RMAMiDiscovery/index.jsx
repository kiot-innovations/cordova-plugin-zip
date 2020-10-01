import React, { useEffect } from 'react'
import { filter, length, propEq } from 'ramda'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import {
  CLAIM_DEVICES_INIT,
  FETCH_CANDIDATES_COMPLETE,
  FETCH_CANDIDATES_INIT,
  RESET_DISCOVERY,
  FETCH_DEVICES_LIST
} from 'state/actions/devices'
import paths from 'routes/paths'
import RMAMiDiscoveryUI from './RMAMiDiscoveryUI'

const miStates = {
  NEW: 'LOADING',
  PINGING: 'LOADING',
  PING_OK: 'LOADING',
  PING_ERROR: 'ERROR',
  GETTING_VERSION_INFORMATION: 'LOADING',
  VERSION_INFORMATION_OK: 'LOADING',
  VERSION_INFORMATION_ERROR: 'ERROR',
  INVALID_SERIAL_NUMBER: 'ERROR',
  GETTING_PLC_STATS: 'LOADING',
  PLC_STATS_OK: 'LOADING',
  PLC_STATS_ERROR: 'ERROR',
  GETTING_PV_INFO: 'LOADING',
  PV_INFO_OK: 'LOADING',
  PV_INFO_ERROR: 'ERROR',
  OK: 'MI_OK'
}

const filterFoundMI = (SNList, candidatesList) => {
  const okMI = []
  const nonOkMI = []
  const pendingMI = []
  SNList.forEach(device => {
    try {
      let deviceCopy = device
      const foundCandidate = candidatesList.find(
        item => item.SERIAL === deviceCopy.serial_number
      )
      if (foundCandidate) {
        deviceCopy = { ...deviceCopy, ...foundCandidate }
        deviceCopy.indicator = miStates[deviceCopy.STATEDESCR]
        if (deviceCopy.indicator === 'MI_OK') {
          okMI.push(deviceCopy)
        } else {
          if (deviceCopy.indicator === 'LOADING') {
            pendingMI.push(deviceCopy)
          } else {
            if (deviceCopy.indicator === 'ERROR') {
              nonOkMI.push(deviceCopy)
            }
          }
        }
      } else {
        deviceCopy.STATEDESCR = miStates.PINGING
        deviceCopy.indicator = 'LOADING'
        pendingMI.push(deviceCopy)
      }
    } catch (e) {
      console.error('Filtering error', e)
    }
  })

  return {
    okMI,
    nonOkMI,
    pendingMI
  }
}

function RMAMiDiscovery() {
  const dispatch = useDispatch()
  const history = useHistory()

  const { serialNumbers } = useSelector(state => state.pvs)

  const {
    candidates,
    claimingDevices,
    claimedDevices,
    claimError,
    error,
    progress,
    discoveryComplete
  } = useSelector(state => state.devices)

  const { okMI, nonOkMI, pendingMI } = filterFoundMI(serialNumbers, candidates)

  const inverter = [...okMI, ...nonOkMI, ...pendingMI]
  const expected = length(serialNumbers)
  const okMICount = length(okMI)
  const errMICount = length(nonOkMI)

  useEffect(() => {
    dispatch(FETCH_CANDIDATES_INIT())
  }, [dispatch])

  useEffect(() => {
    if (expected === okMICount + errMICount) {
      dispatch(FETCH_CANDIDATES_COMPLETE())
    }
  }, [errMICount, expected, okMICount, dispatch])

  useEffect(() => {
    if (claimedDevices) {
      dispatch(FETCH_DEVICES_LIST())
      history.push(paths.PROTECTED.MODEL_EDIT.path)
    }
  }, [claimedDevices, dispatch, history])

  const retryDiscovery = () => {
    dispatch(RESET_DISCOVERY())
    history.push(paths.PROTECTED.SN_LIST.path)
  }

  const claimDevices = () => {
    const claimObject = inverter.map(mi => {
      mi.OPERATION = 'add'
      return mi
    })
    dispatch(CLAIM_DEVICES_INIT(claimObject))
  }

  const claimFoundMI = () => {
    const foundMI = propEq('STATEDESCR', 'OK')
    const filterFoundMI = filter(foundMI, inverter)
    const claimObject = filterFoundMI.map(mi => {
      mi.OPERATION = 'add'
      return mi
    })
    dispatch(CLAIM_DEVICES_INIT(claimObject))
  }

  return (
    <RMAMiDiscoveryUI
      serialNumbers={serialNumbers}
      candidates={candidates}
      claimingDevices={claimingDevices}
      claimedDevices={claimedDevices}
      claimError={claimError}
      error={error}
      progress={progress}
      discoveryComplete={discoveryComplete}
      retryDiscovery={retryDiscovery}
      claimDevices={claimDevices}
      inverter={inverter}
      okMICount={okMICount}
      errMICount={errMICount}
      expected={expected}
      claimFoundMI={claimFoundMI}
    />
  )
}

export default RMAMiDiscovery
