import Logo from '@sunpower/sunpowerimage'
import clsx from 'clsx'
import { path } from 'ramda'
import isNil from 'ramda/src/isNil'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import ConnectionStatus from './ConnectionStatus'

import Menu from 'components/Menu'
import withHeaderAnimation from 'hocs/headerAnimation'
import paths from 'routes/paths'
import { trimString } from 'shared/trim'
import { either, isError } from 'shared/utils'
import { MENU_HIDE, MENU_SHOW } from 'state/actions/ui'

import './Header.scss'

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
  const dispatch = useDispatch()

  const { upgrading, status, percent } = useSelector(
    state => state.firmwareUpdate
  )
  const showMenu = useSelector(path(['ui', 'menu', 'show']))
  const itemToDisplay = useSelector(path(['ui', 'menu', 'itemToDisplay']))
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
          dispatch(itemToDisplay ? MENU_SHOW() : MENU_HIDE())
        } else {
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
