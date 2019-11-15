import React from 'react'
import { useSelector } from 'react-redux'
import Logo from '@sunpower/sunpowerimage'
import isNil from 'ramda/src/isNil'
import { trimString } from 'shared/trim'
import { either } from 'shared/utils'
import './Header.scss'
import { useTransition, animated } from 'react-spring'

const getCount = window => (window.innerWidth > 375 ? 35 : 30)

const Header = ({ text }) => {
  const showHeader = useSelector(({ ui }) => ui.header)
  const grow = useTransition(!!showHeader, null, {
    from: { maxHeight: 0, opacity: 0, marginBottom: '0rem' },
    enter: { maxHeight: 90, opacity: 1, marginBottom: '1.5rem' },
    leave: { maxHeight: 0, opacity: 0, marginBottom: '0rem' }
  })
  return grow.map(
    ({ item, props, key }) =>
      item && (
        <animated.header
          className="header is-flex level is-clipper"
          style={props}
          key={key}
        >
          <span className="sp sp-menu" />
          {either(
            isNil(text),
            <Logo />,
            <span className="text has-text-white" title={text}>
              {trimString(text, getCount(window))}
            </span>
          )}
        </animated.header>
      )
  )
}

export default Header
