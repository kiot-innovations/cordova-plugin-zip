import React from 'react'
import clsx from 'clsx'
import isNil from 'ramda/src/isNil'
import Logo from '@sunpower/sunpowerimage'
import withHeaderAnimation from 'hocs/headerAnimation'
import { trimString } from 'shared/trim'
import { either } from 'shared/utils'
import { toggleRoute } from 'shared/routing'
import { useRouter } from 'hooks'
import paths from 'routes/paths'
import './Header.scss'

const getCount = window => (window.innerWidth > 375 ? 35 : 30)
const isMenuPath = (history, path) => history.location.pathname === path

export const Header = ({
  text,
  icon = 'sp-menu',
  iconOpen = 'sp-chevron-left'
}) => {
  const { history } = useRouter()

  const menuOpen = isMenuPath(history, paths.PROTECTED.MENU.path)
  const menuIcon = menuOpen ? iconOpen : icon
  const classIcon = clsx('sp', menuIcon, { 'has-text-primary': menuOpen })

  return (
    <section className="header is-flex level is-clipper">
      <span
        className={classIcon}
        onClick={toggleRoute(paths.PROTECTED.MENU.path, history)}
        role="button"
      />
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
