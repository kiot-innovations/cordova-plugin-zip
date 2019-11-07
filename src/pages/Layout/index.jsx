import React from 'react'
import { Switch } from 'react-router-dom'
import AppliedRoute from 'routes/AppliedRoute'
import Header from 'components/Header'
import Home from 'pages/Home'
import { withTracker } from 'shared/ga'

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
        </Switch>
      </div>
    </>
  )
}

export default Layout
