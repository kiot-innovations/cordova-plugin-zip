import React from 'react'
import { useSelector } from 'react-redux'
import Logo from '@sunpower/sunpowerimage'
import isNil from 'ramda/src/isNil'
import { useTransition, animated } from 'react-spring'
import { trimString } from 'shared/trim'
import { either } from 'shared/utils'
import { toggleRoute } from 'shared/routing'
import { useRouter } from 'hooks'
import paths from 'routes/paths'
import './Header.scss'

const getCount = window => (window.innerWidth > 375 ? 35 : 30)

const Header = ({ text }) => {
  const showHeader = useSelector(({ ui }) => ui.header)
  const grow = useTransition(!!showHeader, null, {
    from: { maxHeight: 0, opacity: 0, marginBottom: '0rem' },
    enter: { maxHeight: 90, opacity: 1, marginBottom: '1.5rem' },
    leave: { maxHeight: 0, opacity: 0, marginBottom: '0rem' }
  })
  const { history } = useRouter()
  return grow.map(
    ({ item, props, key }) =>
      item && (
        <animated.header
          className="header is-flex level is-clipper"
          style={props}
          key={key}
        >
          <span
            className="sp sp-menu"
            onClick={toggleRoute(paths.PROTECTED.MENU.path, history)}
            role="button"
          />
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
