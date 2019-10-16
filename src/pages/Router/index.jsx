import React from 'react'
import { useSelector } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import moment from 'moment-timezone'
import paths from './paths'
import Home from '../Home'
import Login from '../Login'
import NotFound from '../NotFound'
import PrivateRoute from '../PrivateRoute'

import { withTracker } from '../../shared/ga'

function RouterComponent() {
  const Router = process.env.REACT_APP_IS_MOBILE
    ? require('react-router-dom').HashRouter
    : require('react-router-dom').BrowserRouter

  const isLoggedIn = useSelector(
    state => state.user && state.user.auth && state.user.auth.userId >= 0
  )

  // Needed to keep fake data consistent
  moment.tz.setDefault('America/Chicago')

  return (
    <Router>
      <Switch>
        <PrivateRoute
          exact
          path={paths.ROOT}
          component={withTracker(Home)}
          isLoggedIn={isLoggedIn}
        />
        <Route
          exact
          path={paths.LOGIN}
          component={withTracker(props => (
            <Login {...props} isLoggedIn={isLoggedIn} />
          ))}
        />
        <Route
          component={withTracker(props => (
            <NotFound {...props} isLoggedIn={isLoggedIn} />
          ))}
        />
      </Switch>
    </Router>
  )
}

export default RouterComponent
