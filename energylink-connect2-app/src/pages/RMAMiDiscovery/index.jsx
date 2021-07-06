import React, { useEffect } from 'react'
import { filter, find, length, pathOr, propEq, propOr } from 'ramda'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import {
  CLAIM_DEVICES_INIT,
  FETCH_CANDIDATES_COMPLETE,
  FETCH_CANDIDATES_INIT,
  FETCH_DEVICES_LIST,
  RESET_DISCOVERY,
  SAVE_OK_MI
} from 'state/actions/devices'
import paths from 'routes/paths'
import RMAMiDiscoveryUI from './RMAMiDiscoveryUI'
import { filterFoundMI } from 'shared/utils'

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
    dispatch(SAVE_OK_MI(okMI))
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

  const meterDiscoveryProgress = find(propEq('TYPE', 'PVS5Meter'))(
    pathOr([], ['progress'], progress)
  )

  const areOnboardMetersMissing =
    propEq('complete', true, progress) &&
    propOr(0, 'NFOUND', meterDiscoveryProgress) === 0

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
      areOnboardMetersMissing={areOnboardMetersMissing}
    />
  )
}

export default RMAMiDiscovery
