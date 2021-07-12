import { pathOr } from 'ramda'
import React from 'react'
import { useSelector } from 'react-redux'

import ErrorListScreen from 'pages/ErrorListGeneric'
import { withoutInfoCodes } from 'shared/utils'

const ESSDeviceMappingErrorList = () => {
  const mappingErrors = useSelector(
    pathOr([], ['storage', 'componentMapping', 'errors'])
  )
  const noInfo = withoutInfoCodes(mappingErrors)
  return <ErrorListScreen errors={noInfo} />
}

export default ESSDeviceMappingErrorList
