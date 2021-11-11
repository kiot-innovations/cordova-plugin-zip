import { pathOr } from 'ramda'
import React from 'react'
import { useSelector } from 'react-redux'

import ErrorListScreen from 'pages/ErrorListGeneric'
import { withoutInfoCodes } from 'shared/utils'

const SystemChecksErrorList = () => {
  const {
    productionCTErrors = [],
    consumptionCTErrors = [],
    overallErrors = []
  } = useSelector(pathOr({}, ['systemChecks']))

  const scErrors = productionCTErrors
    .concat(consumptionCTErrors)
    .concat(overallErrors)

  const filteredErrors = withoutInfoCodes(scErrors)

  return (
    <ErrorListScreen
      errors={filteredErrors}
      goBack={true}
      allowCancellingCommissioning={false}
    />
  )
}

export default SystemChecksErrorList
