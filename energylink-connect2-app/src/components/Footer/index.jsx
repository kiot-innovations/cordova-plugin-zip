import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { animated, useTransition } from 'react-spring'
import { useHistory, useLocation } from 'react-router-dom'
import paths, { protectedRoutes, TABS } from 'routes/paths'
import Nav from '@sunpower/nav'
import './footer.scss'

const isActive = (path = '', tab = '') =>
  !!protectedRoutes.find(elem => elem.path === path && elem.tab === tab)

const Footer = () => {
  const history = useHistory()
  const showFooter = useSelector(({ ui }) => ui.footer)
  const [lastInstallPage, setLast] = useState(
    paths.PROTECTED.CONNECT_TO_PVS.path
  )
  const location = useLocation()
  const grow = useTransition(!!showFooter, null, {
    from: { maxHeight: 0, opacity: 0 },
    enter: { maxHeight: 90, opacity: 1 },
    leave: { maxHeight: 0, opacity: 0 }
  })
  const active = useMemo(
    () => ({
      home: isActive(location.pathname, TABS.HOME),
      install: isActive(location.pathname, TABS.INSTALL),
      configure: isActive(location.pathname, TABS.CONFIGURE),
      data: isActive(location.pathname, TABS.DATA)
    }),
    [location]
  )
  useEffect(() => {
    if (active.install) setLast(location.pathname)
  }, [active, location])

  function redirect(path) {
    history.push(path)
  }

  const navBarItems = [
    {
      icon: 'sp-home',
      text: 'Home',
      onClick: () => redirect(paths.PROTECTED.BILL_OF_MATERIALS.path),
      active: active.home
    },
    {
      icon: 'sp-list',
      text: 'Install',
      onClick: () => redirect(lastInstallPage),
      active: active.install
    },
    {
      icon: 'sp-signal',
      text: 'Configure',
      onClick: () => redirect(paths.PROTECTED.SYSTEM_CONFIGURATION.path),
      active: active.configure
    },
    {
      icon: 'sp-data',
      text: 'Data',
      onClick: () => redirect(paths.PROTECTED.DATA.path),
      active: active.data
    }
  ]

  return grow.map(
    ({ item, props, key }) =>
      item && (
        <animated.footer
          style={props}
          key={key}
          className={'custom-footer is-clipper'}
        >
          <Nav items={navBarItems} />
        </animated.footer>
      )
  )
}

export default Footer
