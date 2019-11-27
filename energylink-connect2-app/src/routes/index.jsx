import React, { useLayoutEffect } from 'react'
import { useSelector } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import { animated, useTransition } from 'react-spring'

import CreateSite from 'pages/CreateSite'
import Firmwares from 'pages/Firmwares'
import Home from 'pages/Home'
import Login from 'pages/Login'
import Menu from 'pages/Menu'
import NotFound from 'pages/NotFound'
import PvsConnectionSuccessful from 'pages/PvsConnectionSuccessful'

import { useRouter } from 'hooks'
import { withTracker } from 'shared/ga'
import { routeAuthorization, setLayout } from 'hocs'
import paths from './paths'
import BillOfMaterials from '../pages/BillOfMaterials'
import InventoryCount from '../pages/InventoryCount'

const mapComponents = {
  [paths.PROTECTED.BILL_OF_MATERIALS.path]: BillOfMaterials,
  [paths.PROTECTED.CREATE_SITE.path]: CreateSite,
  [paths.PROTECTED.GIVE_FEEDBACK.path]: NotFound,
  [paths.PROTECTED.LOGOUT.path]: NotFound,
  [paths.PROTECTED.MANAGE_FIRMWARES.path]: Firmwares,
  [paths.PROTECTED.MENU.path]: Menu,
  [paths.PROTECTED.PVS_CONNECTION_SUCCESS.path]: PvsConnectionSuccessful,
  [paths.PROTECTED.ROOT.path]: Home,
  [paths.PROTECTED.VERSION_INFORMATION.path]: NotFound,
  [paths.PROTECTED.INVENTORY_COUNT.path]: InventoryCount,
  [paths.UNPROTECTED.FORGOT_PASSWORD.path]: NotFound,
  [paths.UNPROTECTED.GET_ASSISTANCE.path]: NotFound,
  [paths.UNPROTECTED.LOGIN.path]: Login
}

/**
 * The router of this app
 * @returns {*}
 * @constructor
 */
function AppRoutes() {
  const { location } = useRouter()
  const fadeIn = useTransition(location, loc => loc.pathname, {
    from: { opacity: 0, transform: 'translate(100%,0)' },
    enter: { opacity: 1, transform: 'translate(0%,0)' },
    leave: { opacity: 0, transform: 'translate(-50%,0)' }
  })

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  })
  const isLoggedIn = useSelector(({ user }) => user.auth.userId)
  return fadeIn.map(({ item, props, key, state }) => (
    <animated.div key={key} style={props}>
      <Switch location={item}>
        {Object.values(paths.UNPROTECTED).map(
          ({ path, header = false, footer = false }) => (
            <Route
              key={path}
              path={path}
              exact
              component={routeAuthorization(
                false,
                isLoggedIn,
                state
              )(
                setLayout(
                  header,
                  footer,
                  state
                )(withTracker(mapComponents[path]))
              )}
            />
          )
        )}
        {Object.values(paths.PROTECTED).map(
          ({ path, header = false, footer = false }) => (
            <Route
              key={path}
              path={path}
              exact
              component={routeAuthorization(
                true,
                isLoggedIn,
                state
              )(
                setLayout(
                  header,
                  footer,
                  state
                )(withTracker(mapComponents[path]))
              )}
            />
          )
        )}
        <Route component={NotFound} />
      </Switch>
    </animated.div>
  ))
}

export default AppRoutes
