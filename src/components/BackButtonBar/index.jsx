import React from 'react'
import BackButton from '../BackButton'
import './BackButtonBar.scss'

function BackButtonBar({ history, to }) {
  return (
    <nav
      className="back-button-bar navbar"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand">
        <BackButton history={history} to={to} classNames="mt-10 mb-10" />
      </div>
    </nav>
  )
}

export default BackButtonBar
