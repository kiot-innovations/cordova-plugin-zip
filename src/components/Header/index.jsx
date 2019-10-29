import React from 'react'
import Logo from '@sunpower/sunpowerimage'
import './Header.scss'

function Header() {
  return (
    <header className="header is-flex level">
      <span className="sp-menu" />
      <Logo />
    </header>
  )
}

export default Header
