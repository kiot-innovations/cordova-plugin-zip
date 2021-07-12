import { pathOr } from 'ramda'
import React from 'react'
import { useSelector } from 'react-redux'

import ErrorListScreen from 'pages/ErrorListGeneric'
import { withoutInfoCodes } from 'shared/utils'

const EQSUpdateErrors = () => {
  const updateErrors = useSelector(
    pathOr([], ['storage', 'deviceUpdate', 'errors'])
  )
  const noInfo = withoutInfoCodes(updateErrors)
  return <ErrorListScreen errors={noInfo} />
}

export default EQSUpdateErrors
