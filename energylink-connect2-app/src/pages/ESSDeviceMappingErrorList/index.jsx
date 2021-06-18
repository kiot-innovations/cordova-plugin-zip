import React from 'react'
import { useSelector } from 'react-redux'
import { pathOr } from 'ramda'
import { withoutInfoCodes } from 'shared/utils'
import ErrorListScreen from 'pages/ErrorListGeneric'

const ESSDeviceMappingErrorList = () => {
  const mappingErrors = useSelector(
    pathOr([], ['storage', 'componentMapping', 'errors'])
  )
  const noInfo = withoutInfoCodes(mappingErrors)
  return <ErrorListScreen errors={noInfo} />
}

export default ESSDeviceMappingErrorList
