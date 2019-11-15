import React, { useLayoutEffect } from 'react'
import { useSelector } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import { animated, useTransition } from 'react-spring'
import { useRouter } from 'hooks'
import { withTracker } from 'shared/ga'
import { routeAuthorization, setLayout } from 'hocs'
import {
  CreateSite,
  Home,
  Login,
  Menu,
  NotFound,
  PvsConnectionSuccessful
} from 'pages'
import paths from './paths'

const mapComponents = {
  [paths.PROTECTED.CREATE_SITE.path]: CreateSite,
  [paths.PROTECTED.GIVE_FEEDBACK.path]: null,
  [paths.PROTECTED.LOGOUT.path]: null,
  [paths.PROTECTED.MANAGE_FIRMWARES.path]: null,
  [paths.PROTECTED.MENU.path]: Menu,
  [paths.PROTECTED.PVS_CONNECTION_SUCCESS.path]: PvsConnectionSuccessful,
  [paths.PROTECTED.ROOT.path]: Home,
  [paths.PROTECTED.VERSION_INFORMATION.path]: null,
  [paths.UNPROTECTED.LOGIN.path]: Login,
  [paths.UNPROTECTED.FORGOT_PASSWORD.path]: null,
  [paths.UNPROTECTED.GET_ASSISTANCE.path]: null
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
