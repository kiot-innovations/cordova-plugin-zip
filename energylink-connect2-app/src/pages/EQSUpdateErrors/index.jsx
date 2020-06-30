import React from 'react'
import { useSelector } from 'react-redux'
import { pathOr } from 'ramda'
import ErrorListScreen from 'pages/ErrorListGeneric'

const EQSUpdateErrors = () => {
  const updateErrors = useSelector(
    pathOr([], ['storage', 'deviceUpdate', 'errors'])
  )

  return <ErrorListScreen errors={updateErrors} />
}

export default EQSUpdateErrors
