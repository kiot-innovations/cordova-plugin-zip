import { propOr } from 'ramda'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

import DiscoveryError from './DiscoveryError'
import OtherDevicesList from './OtherDevicesList'

import useRetryStringInverterDiscovery from 'hooks/useRetryLegacyDiscovery'
import NoInverters from 'pages/StringInverters/NoInverters'
import { either, getOverallDiscoveryProgress } from 'shared/utils'
import { discoveryTypes } from 'state/reducers/devices'

const StringInverters = () => {
  const { lastDiscoveryType } = useSelector(state => state.pvs)
  const { progress, isFetching } = useSelector(propOr([], 'devices'))

  const discoveryProgress = getOverallDiscoveryProgress(progress) || 0
  const retryDiscovery = useRetryStringInverterDiscovery()

  useEffect(() => {
    if (lastDiscoveryType !== discoveryTypes.LEGACY && discoveryProgress === 0)
      retryDiscovery()
  }, [lastDiscoveryType, discoveryProgress, retryDiscovery])

  return (
    <>
      {either(
        discoveryProgress === 0,
        <NoInverters isFetching={isFetching} />,
        <OtherDevicesList />
      )}
      <DiscoveryError />
    </>
  )
}

export default StringInverters
