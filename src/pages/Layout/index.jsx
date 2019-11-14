import React from 'react'
import { Switch } from 'react-router-dom'
import AppliedRoute from 'routes/AppliedRoute'
import Header from 'components/Header'

import Home from 'pages/Home'
import CreateSite from 'pages/CreateSite'

import { withTracker } from 'shared/ga'
import { paths } from 'routes/paths'
import PvsConnectionSuccessful from 'pages/PvsConnectionSuccessful'

function Layout(props) {
  return (
    <>
      <Header />
      <div className="ml-10 mr-10 mt-10 mb-10">
        <Switch>
          <AppliedRoute
            exact
            path="/"
            component={withTracker(Home)}
            props={props}
          />
          <AppliedRoute
            exact
            path={paths.PROTECTED.PVS_CONNECTION_SUCCESS}
            component={withTracker(PvsConnectionSuccessful)}
            props={props}
          />
          <AppliedRoute
            exact
            path={paths.PROTECTED.CREATE_SITE}
            component={withTracker(CreateSite)}
            props={props}
          />
        </Switch>
      </div>
    </>
  )
}

export default Layout
