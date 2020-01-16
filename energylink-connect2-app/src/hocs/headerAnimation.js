import React from 'react'
import { useSelector } from 'react-redux'
import { useTransition, animated } from 'react-spring'

const withHaderAnimation = Child => {
  const HOC = childProps => {
    const showHeader = useSelector(({ ui }) => ui.header)
    const grow = useTransition(!!showHeader, null, {
      from: { maxHeight: 0, opacity: 0, marginBottom: '0' },
      enter: { maxHeight: 90, opacity: 1, marginBottom: '0' },
      leave: { maxHeight: 0, opacity: 0, marginBottom: '0' }
    })
    return grow.map(
      ({ item, props, key }) =>
        item && (
          <animated.header style={props} key={key}>
            <Child {...childProps} />
          </animated.header>
        )
    )
  }

  return HOC
}

export default withHaderAnimation
