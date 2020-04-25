import React, { useEffect } from 'react'
import clsx from 'clsx'
import { useDispatch } from 'react-redux'
import { setHeader, setFooter } from 'state/actions/ui'
import './layout.scss'

const setLayout = (header, footer) => ChildComponent => props => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setHeader(header))
    dispatch(setFooter(footer))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      className={clsx({
        'custom-layout': true,
        'with-footer': footer,
        'without-footer': !footer,
        'without-header': !header
      })}
    >
      <ChildComponent {...props} />
    </div>
  )
}

export default setLayout
