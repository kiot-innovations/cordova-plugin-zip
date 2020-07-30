import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { add, path, length, pluck, propOr, reduce } from 'ramda'
import { GET_ESS_STATUS_INIT } from 'state/actions/storage'
import { RESET_DISCOVERY } from 'state/actions/devices'
import paths from 'routes/paths'
import ESSHealthCheckComponent from 'components/ESSHealthCheck'

function ESSHealthCheck() {
  const dispatch = useDispatch()
  const { waiting, results, error } = useSelector(state => state.storage.status)
  const { progress } = useSelector(state => state.devices)
  const rmaPvs = useSelector(path(['rma', 'pvs']))

  const discoveryProgress = propOr([], 'progress', progress)
  const deviceProgress = pluck('PROGR', discoveryProgress)
  const deviceStartProgress =
    waiting && deviceProgress === 100 ? 0 : deviceProgress
  const overallProgress = Math.floor(
    reduce(add, 0, deviceStartProgress) / length(deviceProgress)
  )

  useEffect(() => {
    dispatch(RESET_DISCOVERY())
    dispatch(GET_ESS_STATUS_INIT())
  }, [dispatch])

  const onRetry = () => dispatch(GET_ESS_STATUS_INIT())

  const pathToContinue = rmaPvs
    ? paths.PROTECTED.SYSTEM_CONFIGURATION.path
    : paths.PROTECTED.INSTALL_SUCCESS.path

  const pathToErrors = paths.PROTECTED.ESS_HEALTH_CHECK_ERRORS.path

  return (
    <div className="pl-10 pr-10">
      <ESSHealthCheckComponent
        waiting={waiting}
        progress={overallProgress}
        results={results}
        error={error}
        onRetry={onRetry}
        pathToContinue={pathToContinue}
        pathToErrors={pathToErrors}
      />
    </div>
  )
}

export default ESSHealthCheck
