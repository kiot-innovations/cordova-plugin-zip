import React from 'react'
import { useDispatch } from 'react-redux'
import Tile from '@sunpower/tile'
import paths from 'routes/paths'
import menuItems from 'components/Header/menuItems'
import { useI18n } from 'shared/i18n'
import { LOGOUT } from 'state/actions/auth'

function Menu(props) {
  const t = useI18n()
  const dispatch = useDispatch()

  const logout = () => {
    props.history.push(paths.PROTECTED.ROOT.path)
    dispatch(LOGOUT())
  }

  return (
    <section className="is-flex tile is-vertical level full-height">
      <article className="is-flex space-around flow-wrap mt-15">
        {menuItems.map(menuItem => (
          <div className="mb-30" key={menuItem.text}>
            <Tile
              icon={menuItem.icon}
              text={t(menuItem.text)}
              onClick={open(menuItem.to, props.history)}
            />
          </div>
        ))}
      </article>
      <button
        className="button has-text-centered is-uppercase mb-10 has-text-primary is-text"
        onClick={logout}
      >
        {t('BTN_LOG_OUT')}
      </button>
    </section>
  )
}

export default Menu

const open = (to, history) => () => history.push(to)
