import React from 'react'
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

export default (
  isProtected,
  isLoggedIn,
  animationState
) => ChildrenComponent => {
  const HocComponent = ({ ...props }) => {
    if (
      isProtected &&
      !isLoggedIn &&
      (animationState === 'enter' || animationState === 'update')
    )
      return (
        <Redirect
          to={`/login?redirect=${props.location.pathname}${props.location.search}`}
        />
      )
    if (
      !isProtected &&
      isLoggedIn &&
      (animationState === 'enter' || animationState === 'update')
    ) {
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
