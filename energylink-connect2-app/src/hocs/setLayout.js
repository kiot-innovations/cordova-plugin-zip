import clsx from 'clsx'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import ErrorBoundary from 'components/Error'
import HooksInitializer from 'pages/HooksInitializer'
import { setHeader, setFooter } from 'state/actions/ui'
import './layout.scss'

const setLayout = (header, footer) => ChildComponent => props => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setHeader(header))
    dispatch(setFooter(footer))
  }, [dispatch])

  return (
    <div
      className={clsx({
        'custom-layout': true,
        'with-footer': footer,
        'without-footer': !footer,
        'without-header': !header
      })}
    >
      <ErrorBoundary>
        <ChildComponent {...props} />
        <HooksInitializer />
      </ErrorBoundary>
    </div>
  )
}

export default setLayout
