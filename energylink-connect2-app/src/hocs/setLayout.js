import React, { useEffect } from 'react'
import clsx from 'clsx'
import { useDispatch } from 'react-redux'
import { setHeader, setFooter } from 'state/actions/ui'
import './layout.scss'
import ErrorBoundary from 'components/Error'

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
      </ErrorBoundary>
    </div>
  )
}

export default setLayout
