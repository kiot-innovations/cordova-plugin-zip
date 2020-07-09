import React, { useState } from 'react'
import clsx from 'clsx'
import { useSelector } from 'react-redux'
import isNil from 'ramda/src/isNil'
import Logo from '@sunpower/sunpowerimage'
import withHeaderAnimation from 'hocs/headerAnimation'
import { trimString } from 'shared/trim'
import { either } from 'shared/utils'
import { useHistory, useLocation } from 'react-router-dom'
import paths from 'routes/paths'
import './Header.scss'

const getCount = window => (window.innerWidth > 375 ? 35 : 30)
const isMenuPath = history =>
  history.location.pathname === paths.PROTECTED.MENU.path ||
  history.location.pathname !== paths.PROTECTED.MANAGE_FIRMWARES.path ||
  history.location.pathname !== paths.PROTECTED.VERSION_INFORMATION.path ||
  history.location.pathname !== paths.PROTECTED.GIVE_FEEDBACK.path

export const Header = ({
  text,
  icon = 'sp-menu',
  iconOpen = 'sp-chevron-left'
}) => {
  const history = useHistory()
  const location = useLocation()
  const { upgrading, status } = useSelector(state => state.firmwareUpdate)
  const [lastScreen, setLastScreen] = useState(() =>
    location.pathname === paths.PROTECTED.MENU.path ? '/' : location.pathname
  )

  const shouldDisableMenu =
    upgrading ||
    (history.location.path === paths.PROTECTED.UPDATE.path &&
      status !== 'UPGRADE_COMPLETE')

  const menuOpen = isMenuPath(history)
  const menuIcon = menuOpen ? iconOpen : icon
  const classIcon = clsx('sp', menuIcon, {
    'has-text-primary': menuOpen,
    disabled: shouldDisableMenu
  })

  const menuAction = shouldDisableMenu
    ? void 0
    : () => {
        if (location.pathname === paths.PROTECTED.MENU.path)
          history.push(lastScreen)
        else {
          if (
            location.pathname !== paths.PROTECTED.MANAGE_FIRMWARES.path &&
            location.pathname !== paths.PROTECTED.VERSION_INFORMATION.path &&
            location.pathname !== paths.PROTECTED.GIVE_FEEDBACK.path
          )
            setLastScreen(location.pathname)
          history.push(paths.PROTECTED.MENU.path)
        }
      }

  return (
    <section className="header is-flex level is-clipper">
      <span className={classIcon} onClick={menuAction} role="button" />
      {either(
        isNil(text),
        <Logo />,
        <span className="text has-text-white" title={text}>
          {trimString(text, getCount(window))}
        </span>
      )}
    </section>
  )
}

export default withHeaderAnimation(Header)
