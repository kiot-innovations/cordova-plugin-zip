import React, { useLayoutEffect } from 'react'
import { Route, Switch } from 'react-router-dom'
import { paths } from './paths'
import { useRouter } from 'hooks'
import { animated, useTransition } from 'react-spring'
import { NotFound } from 'pages'
import { routeAuthorization, setLayout } from 'hocs'
import { useSelector } from 'react-redux'

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
          ({ path, component, header = false, footer = false }) => (
            <Route
              key={path}
              path={path}
              exact
              component={routeAuthorization(
                false,
                isLoggedIn,
                state
              )(setLayout(header, footer, state)(component))}
            />
          )
        )}
        {Object.values(paths.PROTECTED).map(
          ({ path, component, header = false, footer = false }) => (
            <Route
              key={path}
              path={path}
              exact
              component={routeAuthorization(
                true,
                isLoggedIn,
                state
              )(setLayout(header, footer, state)(component))}
            />
          )
        )}
        <Route component={NotFound} />
      </Switch>
    </animated.div>
  ))
}

export default AppRoutes
