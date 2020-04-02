import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { propOr } from 'ramda'
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

  useEffect(() => {
    const customFooter = document.querySelector('.custom-footer')
    const offSetTop = propOr(0, 'offsetTop', customFooter)
    const clientHeight = propOr(0, 'clientHeight', document.body)

    if (customFooter && clientHeight - offSetTop > 120)
      customFooter.style.top = '100%'
  })

  return (
    <div
      className={clsx({
        'custom-layout': true,
        'with-footer': footer,
        'without-footer': !footer,
        'without-header': !header
      })}
    >
      <ChildComponent {...props} animationState={animationState} />
    </div>
  )
}

export default setLayout
