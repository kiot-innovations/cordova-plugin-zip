import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { AlertsIcon, HamburgerMenu, Profile } from './Icons'
import './MainNavBar.scss'
import paths from '../../pages/Router/paths'

function MainNavBar({ location }) {
  const hasAlerts = useSelector(
    state =>
      state.alerts &&
      Object.keys(state.alerts.data).filter(
        k => !state.alerts.data[k].seenTimestamp
      ).length >= 0
  )
  const userName = useSelector(
    state => state.user && state.user.data && state.user.data.firstName
  )
  const title = userName ? `${userName}'s home` : 'home'

  return (
    <nav
      className="main-nav-bar navbar"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="header-container columns is-mobile">
        <div className="column">
          <Link
            className="link"
            to={{
              pathname: paths.MENU,
              state: {
                from: location.pathname
              }
            }}
          >
            <HamburgerMenu />
          </Link>
        </div>
        <div className="column is-two-thirds header is-flex">
          <h1 className="navbar-header">{title}</h1>
        </div>
        <div className="column actions">
          <Link
            to={{
              pathname: paths.NOTIFICATIONS,
              state: {
                from: location.pathname
              }
            }}
          >
            <div className="alerts-bell pr-5">
              <AlertsIcon />
              <div className={hasAlerts ? 'has-alerts' : 'is-hidden'}></div>
            </div>
          </Link>
          <Link
            to={{
              pathname: paths.PROFILE,
              state: {
                from: location.pathname
              }
            }}
          >
            <div className="pl-5">
              <Profile />
            </div>
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default MainNavBar
