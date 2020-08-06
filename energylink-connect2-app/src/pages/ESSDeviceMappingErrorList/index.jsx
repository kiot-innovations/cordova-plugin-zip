import React from 'react'
import { useSelector } from 'react-redux'
import { pathOr } from 'ramda'
import ErrorListScreen from 'pages/ErrorListGeneric'

const ESSDeviceMappingErrorList = () => {
  const mappingErrors = useSelector(
    pathOr([], ['storage', 'componentMapping', 'errors'])
  )

  return <ErrorListScreen errors={mappingErrors} />
}

export default ESSDeviceMappingErrorList
