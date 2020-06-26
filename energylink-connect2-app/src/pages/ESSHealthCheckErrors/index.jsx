import React from 'react'
import { useSelector } from 'react-redux'
import ESSHealthCheckErrorsComponent from 'components/ESSHealthCheckErrorList'

function ESSHealthCheckErrors() {
  const { results, error } = useSelector(state => state.storage.status)

  return (
    <div className="pl-10 pr-10">
      <ESSHealthCheckErrorsComponent results={results} error={error} />
    </div>
  )
}

export default ESSHealthCheckErrors
