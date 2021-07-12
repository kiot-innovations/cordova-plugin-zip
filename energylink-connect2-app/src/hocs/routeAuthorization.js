import React from 'react'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'

function querystring(name, url = window.location.href) {
  name = name.replace(/[[]]/g, '\\$&')

  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)', 'i')
  const results = regex.exec(url)

  if (!results) {
    return null
  }
  if (!results[2]) {
    return ''
  }

  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

export default isProtected => ChildrenComponent => {
  const HocComponent = ({ ...props }) => {
    const isLoggedIn = useSelector(({ user }) => user.auth.access_token)

    if (isProtected && !isLoggedIn)
      return (
        <Redirect
          to={`/login?redirect=${props.location.pathname}${props.location.search}`}
        />
      )
    if (!isProtected && isLoggedIn) {
      const redirect = querystring('redirect')
      return (
        <Redirect to={redirect === '' || redirect === null ? '/' : redirect} />
      )
    }
    return <ChildrenComponent {...props} />
  }

  HocComponent.propTypes = {}

  return HocComponent
}
