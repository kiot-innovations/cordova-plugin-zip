import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { START_DISCOVERY_INIT } from 'state/actions/pvs'
import { discoveryTypes } from 'state/reducers/devices'

const useRetryStringInverterDiscovery = () => {
  const dispatch = useDispatch()
  return useCallback(() => {
    dispatch(
      START_DISCOVERY_INIT({
        Device: 'allnomi',
        KeepDevices: '1',
        type: discoveryTypes.LEGACY
      })
    )
  }, [dispatch])
}

export default useRetryStringInverterDiscovery
