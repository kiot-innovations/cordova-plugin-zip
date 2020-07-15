import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { add, length, pluck, propOr, reduce } from 'ramda'
import { GET_ESS_STATUS_INIT } from 'state/actions/storage'
import { RESET_DISCOVERY } from 'state/actions/devices'
import paths from 'routes/paths'
import ESSHealthCheckComponent from 'components/ESSHealthCheck'

function ESSHealthCheck() {
  const history = useHistory()
  const dispatch = useDispatch()
  const { waiting, results, error } = useSelector(state => state.storage.status)
  const { progress } = useSelector(state => state.devices)

  const discoveryProgress = propOr([], 'progress', progress)
  const deviceProgress = pluck('PROGR', discoveryProgress)
  const overallProgress = Math.floor(
    reduce(add, 0, deviceProgress) / length(deviceProgress)
  )

  useEffect(() => {
    dispatch(RESET_DISCOVERY())
    dispatch(GET_ESS_STATUS_INIT())
  }, [dispatch])

  const onContinue = () => history.push(paths.PROTECTED.INSTALL_SUCCESS.path)
  const onRetry = () => dispatch(GET_ESS_STATUS_INIT())
  const onSeeErrors = () =>
    history.push(paths.PROTECTED.ESS_HEALTH_CHECK_ERRORS.path)

  return (
    <div className="pl-10 pr-10">
      <ESSHealthCheckComponent
        waiting={waiting}
        progress={overallProgress}
        results={results}
        error={error}
        onContinue={onContinue}
        onRetry={onRetry}
        onSeeErrors={onSeeErrors}
      />
    </div>
  )
}

export default ESSHealthCheck
