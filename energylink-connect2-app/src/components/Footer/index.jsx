import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import Nav from '@sunpower/nav'
import clsx from 'clsx'
import paths, { protectedRoutes, TABS } from 'routes/paths'
import { SET_LAST_VISITED_PAGE } from 'state/actions/global'

import './footer.scss'

const isActive = (path = '', tab = '') =>
  !!protectedRoutes.find(elem => elem.path === path && elem.tab === tab)

//The animation values that we are going to use are
//
// closed -> maxHeight: 0, opacity: 0
// open -> maxHeight: 90, opacity: 1

const Footer = () => {
  const history = useHistory()
  const dispatch = useDispatch()

  const showFooter = useSelector(({ ui }) => !!ui.footer)
  const connected = useSelector(({ network }) => network.connected)
  const lastVisitedPage = useSelector(({ global }) => global.lastVisitedPage)

  const location = useLocation()
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
    if (active.install) {
      const destination = connected
        ? location.pathname
        : paths.PROTECTED.PVS_SELECTION_SCREEN.path
      dispatch(SET_LAST_VISITED_PAGE(destination))
    }
  }, [active, connected, dispatch, location])

  function redirect(path) {
    if (path !== location.pathname) history.push(path)
  }

  const configureClickHandler = connected
    ? () => redirect(paths.PROTECTED.SYSTEM_CONFIGURATION.path)
    : () => {}
  const liveDataClickHandler = connected
    ? () => redirect(paths.PROTECTED.DATA.path)
    : () => {}

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
      onClick: () => redirect(lastVisitedPage),
      active: active.install
    },
    {
      icon: 'sp-signal',
      text: 'Configure',
      onClick: configureClickHandler,
      active: active.configure
    },
    {
      icon: 'sp-data',
      text: 'Live Data',
      onClick: liveDataClickHandler,
      active: active.data
    }
  ]

  return (
    <footer
      className={clsx('custom-footer is-clipper', {
        'show-footer': showFooter,
        'hide-footer': !showFooter
      })}
    >
      <Nav items={navBarItems} />
    </footer>
  )
}

export default Footer
