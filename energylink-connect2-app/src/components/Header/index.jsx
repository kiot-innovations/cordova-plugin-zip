import React from 'react'
import clsx from 'clsx'
import isNil from 'ramda/src/isNil'
import { useSelector } from 'react-redux'
import { useTransition, animated } from 'react-spring'
import Logo from '@sunpower/sunpowerimage'
import { trimString } from 'shared/trim'
import { either } from 'shared/utils'
import { toggleRoute } from 'shared/routing'
import { useRouter } from 'hooks'
import paths from 'routes/paths'
import './Header.scss'

const getCount = window => (window.innerWidth > 375 ? 35 : 30)
const isMenuPath = (history, path) => history.location.pathname === path

const Header = ({ text, icon = 'sp-menu', iconOpen = 'sp-chevron-left' }) => {
  const showHeader = useSelector(({ ui }) => ui.header)
  const grow = useTransition(!!showHeader, null, {
    from: { maxHeight: 0, opacity: 0, marginBottom: '0rem' },
    enter: { maxHeight: 90, opacity: 1, marginBottom: '1.5rem' },
    leave: { maxHeight: 0, opacity: 0, marginBottom: '0rem' }
  })
  const { history } = useRouter()

  const menuOpen = isMenuPath(history, paths.PROTECTED.MENU.path)
  const menuIcon = menuOpen ? iconOpen : icon
  const classIcon = clsx('sp', menuIcon, { 'has-text-primary': menuOpen })

  return grow.map(
    ({ item, props, key }) =>
      item && (
        <animated.header
          className="header is-flex level is-clipper"
          style={props}
          key={key}
        >
          <span
            className={classIcon}
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
