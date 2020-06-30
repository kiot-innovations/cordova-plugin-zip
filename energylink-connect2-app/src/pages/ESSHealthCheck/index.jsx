import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { GET_ESS_STATUS_INIT } from 'state/actions/storage'
import paths from 'routes/paths'

import ESSHealthCheckComponent from 'components/ESSHealthCheck'

function ESSHealthCheck() {
  const history = useHistory()
  const dispatch = useDispatch()
  const { results, error } = useSelector(state => state.storage.status)

  useEffect(() => {
    dispatch(GET_ESS_STATUS_INIT())
  }, [dispatch])

  const onContinue = () => history.push(paths.PROTECTED.INSTALL_SUCCESS.path)
  const onRetry = () => dispatch(GET_ESS_STATUS_INIT())
  const onSeeErrors = () =>
    history.push(paths.PROTECTED.ESS_HEALTH_CHECK_ERRORS.path)

  return (
    <div className="pl-10 pr-10">
      <ESSHealthCheckComponent
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
