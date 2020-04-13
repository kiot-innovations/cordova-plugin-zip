import clsx from 'clsx'
import React from 'react'
import { useSelector } from 'react-redux'

const withHaderAnimation = Child => {
  const HOC = childProps => {
    const showHeader = useSelector(({ ui }) => !!ui.header)
    return (
      <header
        className={clsx('header-transition', {
          'show-footer': showHeader,
          'hide-footer': !showHeader
        })}
      >
        <Child {...childProps} />
      </header>
    )
  }

  return HOC
}

export default withHaderAnimation
