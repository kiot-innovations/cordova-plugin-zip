import React from 'react'
import { useSelector } from 'react-redux'
import ErrorListScreen from 'pages/ErrorListGeneric'

function ESSHealthCheckErrors() {
  const { results } = useSelector(state => state.storage.status)
  const { errors = [] } = results
  return (
    <div className="pl-10 pr-10">
      <ErrorListScreen errors={errors} />
    </div>
  )
}

export default ESSHealthCheckErrors
