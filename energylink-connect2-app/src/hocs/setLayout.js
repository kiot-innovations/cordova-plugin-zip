import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setHeader, setFooter } from 'state/actions/ui'
import clsx from 'clsx'
import './layout.scss'

const setLayout = (
  header,
  footer,
  animationState
) => ChildComponent => props => {
  const dispatch = useDispatch()
  useEffect(() => {
    if (animationState === 'enter') {
      dispatch(setHeader(header))
      dispatch(setFooter(footer))
    }
  }, [dispatch])
  return (
    <div
      className={clsx({
        'custom-layout': true,
        'with-footer': footer,
        'without-footer': !footer
      })}
    >
      <ChildComponent {...props} />
    </div>
  )
}

export default setLayout
