import React from 'react'
import { useSelector } from 'react-redux'
import { pathOr } from 'ramda'
import ErrorListScreen from 'pages/ErrorListGeneric'

const EQSPrediscoveryErrors = () => {
  const prediscoveryErrors = useSelector(
    pathOr([], ['storage', 'prediscovery', 'errors'])
  )

  return <ErrorListScreen errors={prediscoveryErrors} />
}

export default EQSPrediscoveryErrors
