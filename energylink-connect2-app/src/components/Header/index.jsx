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

const getCount = window => (window.innerWidth > 375 ? 35 : 30)
const isMenuPath = history =>
  history.location.pathname === paths.PROTECTED.MANAGE_FIRMWARES.path ||
  history.location.pathname === paths.PROTECTED.VERSION_INFORMATION.path ||
  history.location.pathname === paths.PROTECTED.GIVE_FEEDBACK.path

export const Header = ({ icon = 'sp-menu', iconOpen = 'sp-chevron-left' }) => {
  const history = useHistory()
  const location = useLocation()
  const dispatch = useDispatch()

  const { upgrading, status, percent } = useSelector(
    state => state.firmwareUpdate
  )
  const showMenu = useSelector(path(['ui', 'menu', 'show']))
  const previousURL = useSelector(path(['ui', 'menu', 'previousURL']))
  const siteAddress = useSelector(path(['site', 'site', 'address1']))
  const shouldDisableMenu = upgrading && !isError(status, percent)

  const menuOpen = isMenuPath(history) || showMenu
  const menuIcon = menuOpen ? iconOpen : icon
  const classIcon = clsx('sp', menuIcon, {
    'has-text-primary': menuOpen,
    disabled: shouldDisableMenu
  })

  const menuAction = shouldDisableMenu
    ? void 0
    : () => {
        if (menuOpen) {
          dispatch(MENU_HIDE())
          history.push(previousURL)
        } else {
          dispatch(SET_PREVIOUS_URL(location.pathname))
          dispatch(MENU_SHOW())
        }
      }

  return (
    <>
      <section className="header is-flex level is-clipper">
        <span className={classIcon} onClick={menuAction} role="button" />
        {either(
          isNil(siteAddress),
          <Logo />,
          <span className="text has-text-white" title={siteAddress}>
            {trimString(siteAddress, getCount(window))}
          </span>
        )}
      </section>
      <Menu />
    </>
  )
}

export default withHeaderAnimation(Header)
