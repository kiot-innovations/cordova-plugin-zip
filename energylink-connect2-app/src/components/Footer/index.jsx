import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import { isNil } from 'ramda'
import clsx from 'clsx'

import Nav from '@sunpower/nav'

import { SET_LAST_VISITED_PAGE } from 'state/actions/global'
import { appConnectionStatus } from 'state/reducers/network'

import paths, { protectedRoutes, TABS } from 'routes/paths'

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
  const { connectionStatus } = useSelector(state => state.network)
  const { lastVisitedPage, showPrecommissioningChecklist } = useSelector(
    state => state.global
  )

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
      const destination =
        connectionStatus === appConnectionStatus.CONNECTED
          ? location.pathname
          : paths.PROTECTED.PVS_SELECTION_SCREEN.path
      dispatch(SET_LAST_VISITED_PAGE(destination))
    }
  }, [active, connectionStatus, dispatch, location])

  function redirect(path) {
    if (path !== location.pathname) history.push(path)
  }

  const installRedirect = lastVisitedPage => {
    if (isNil(lastVisitedPage)) {
      return showPrecommissioningChecklist
        ? paths.PROTECTED.PRECOMM_CHECKLIST.path
        : paths.PROTECTED.PVS_SELECTION_SCREEN.path
    }
    return lastVisitedPage
  }

  const configureClickHandler =
    connectionStatus === appConnectionStatus.CONNECTED
      ? () => redirect(paths.PROTECTED.SYSTEM_CONFIGURATION.path)
      : () => {}
  const liveDataClickHandler =
    connectionStatus === appConnectionStatus.CONNECTED
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
      onClick: () => redirect(installRedirect(lastVisitedPage)),
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
      text: 'Status',
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
