import React from 'react'
import { useSelector } from 'react-redux'
import { pathOr } from 'ramda'
import { withoutInfoCodes } from 'shared/utils'
import ErrorListScreen from 'pages/ErrorListGeneric'

const EQSUpdateErrors = () => {
  const updateErrors = useSelector(
    pathOr([], ['storage', 'deviceUpdate', 'errors'])
  )
  const noInfo = withoutInfoCodes(updateErrors)
  return <ErrorListScreen errors={noInfo} />
}

export default EQSUpdateErrors
