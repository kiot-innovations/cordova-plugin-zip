import { pathOr } from 'ramda'
import React from 'react'
import { useSelector } from 'react-redux'

import ErrorListScreen from 'pages/ErrorListGeneric'
import { withoutInfoCodes } from 'shared/utils'

const EQSPrediscoveryErrors = () => {
  const prediscoveryErrors = useSelector(
    pathOr([], ['storage', 'prediscovery', 'errors'])
  )
  const noInfo = withoutInfoCodes(prediscoveryErrors)
  return <ErrorListScreen errors={noInfo} />
}

export default EQSPrediscoveryErrors
