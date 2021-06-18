import React from 'react'
import { useSelector } from 'react-redux'
import { pathOr } from 'ramda'
import { withoutInfoCodes } from 'shared/utils'
import ErrorListScreen from 'pages/ErrorListGeneric'

const EQSPrediscoveryErrors = () => {
  const prediscoveryErrors = useSelector(
    pathOr([], ['storage', 'prediscovery', 'errors'])
  )
  const noInfo = withoutInfoCodes(prediscoveryErrors)
  return <ErrorListScreen errors={noInfo} />
}

export default EQSPrediscoveryErrors
