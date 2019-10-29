import React, { useEffect, useLayoutEffect } from 'react'
import { Route, Switch } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import gte from 'ramda/src/gte'
import pathOr from 'ramda/src/pathOr'

import AuthenticatedRoute from './AuthenticatedRoute'
import UnauthenticatedRoute from './UnauthenticatedRoute'

import Login from 'pages/Login'
import NotFound from 'pages/NotFound'
import Layout from 'pages/Layout'

import { deviceResumeListener } from 'state/actions/mobile'
import { validateSession } from 'state/actions/auth'
import { paths } from './paths'
import { withTracker } from 'shared/ga'

function AppRoutes() {
  const Router = process.env.REACT_APP_IS_MOBILE
    ? require('react-router-dom').HashRouter
    : require('react-router-dom').BrowserRouter

  const dispatch = useDispatch()

  const childProps = useSelector(state => {
    const lookup = ['user', 'auth']
    const authOb = pathOr({ userId: -1 }, lookup, state)
    return {
      isAuthenticated: gte(authOb.userId, 0),
      isAuthenticating: authOb.isAuthenticating
    }
  })

  useEffect(() => {
    if (childProps.isAuthenticated) {
      dispatch(deviceResumeListener())
      dispatch(validateSession())
    }
  }, [childProps.isAuthenticated, dispatch])

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  })

  return (
    <Router>
      <Switch>
        <UnauthenticatedRoute
          path={paths.LOGIN}
          exact
          component={withTracker(Login)}
          props={childProps}
        />
        <AuthenticatedRoute
          path={Object.values(paths.PROTECTED)}
          exact
          component={Layout}
          props={childProps}
        />
        <Route component={NotFound} />
      </Switch>
    </Router>
  )
}

export default AppRoutes
