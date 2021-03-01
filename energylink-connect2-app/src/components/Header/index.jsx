import React from 'react'
import { path } from 'ramda'
import clsx from 'clsx'
import { useDispatch, useSelector } from 'react-redux'
import isNil from 'ramda/src/isNil'
import Logo from '@sunpower/sunpowerimage'
import withHeaderAnimation from 'hocs/headerAnimation'
import { trimString } from 'shared/trim'
import { either, isError } from 'shared/utils'
import { useHistory, useLocation } from 'react-router-dom'
import paths from 'routes/paths'
import Menu from 'components/Menu'
import { MENU_HIDE, MENU_SHOW, SET_PREVIOUS_URL } from 'state/actions/ui'

import './Header.scss'
import ConnectionStatus from './ConnectionStatus'

const getCount = window => (window.innerWidth > 375 ? 35 : 30)
const isMenuPath = history =>
  history.location.pathname === paths.PROTECTED.MANAGE_FIRMWARES.path ||
  history.location.pathname === paths.PROTECTED.VERSION_INFORMATION.path ||
  history.location.pathname === paths.PROTECTED.GIVE_FEEDBACK.path
const showSiteAddress = history =>
  history.location.pathname !== paths.PROTECTED.ROOT.path &&
  history.location.pathname !== paths.PROTECTED.CREATE_SITE.path &&
  history.location.pathname !== paths.PROTECTED.BILL_OF_MATERIALS.path

export const Header = ({ icon = 'sp-menu', iconOpen = 'sp-chevron-left' }) => {
  const history = useHistory()
  const location = useLocation()
  const dispatch = useDispatch()

  const { upgrading, status, percent } = useSelector(
    state => state.firmwareUpdate
  )
  const showMenu = useSelector(path(['ui', 'menu', 'show']))
  const itemToDisplay = useSelector(path(['ui', 'menu', 'itemToDisplay']))
  const previousURL = useSelector(path(['ui', 'menu', 'previousURL']))
  const siteAddress = useSelector(path(['site', 'site', 'address1']))
  const shouldDisableMenu = upgrading && !isError(status, percent)

  const menuOpen = isMenuPath(history) || showMenu
  const menuIcon = menuOpen ? iconOpen : icon
  const classIcon = clsx('sp', menuIcon, {
    'has-text-primary': menuOpen,
    disabled: shouldDisableMenu
  })

  const connectionStatus = useSelector(path(['network', 'connectionStatus']))

  const menuAction = shouldDisableMenu
    ? void 0
    : () => {
        if (menuOpen) {
          const action = itemToDisplay ? MENU_SHOW() : MENU_HIDE()
          dispatch(action)
          history.push(previousURL)
        } else {
          dispatch(SET_PREVIOUS_URL(location.pathname))
          dispatch(MENU_SHOW())
        }
      }

  return (
    <>
      <div className="header level is-clipper">
        <span className={classIcon} onClick={menuAction} role="button" />
        {either(
          showSiteAddress(history) && !isNil(siteAddress),
          <span className="text has-text-white" title={siteAddress}>
            {trimString(siteAddress, getCount(window))}
          </span>,
          <Logo />
        )}
        <ConnectionStatus status={connectionStatus} />
      </div>
      <Menu />
    </>
  )
}

export default withHeaderAnimation(Header)
