import React from 'react'
import { Route } from 'react-router-dom'

export default ({ component: C, props, ...rest }) => (
  <Route {...rest} render={rprops => <C {...rprops} {...props} />} />
)
