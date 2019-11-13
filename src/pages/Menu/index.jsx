import React from 'react'
import { Link } from 'react-router-dom'
import Tile from '@sunpower/tile'
import menuItems from 'components/Header/menuItems'
import { paths } from 'routes/paths'
import { useI18n } from 'shared/i18n'

function Menu(props) {
  const t = useI18n()
  return (
    <section className="is-flex tile is-vertical level page-height">
      <article className="is-flex space-around flow-wrap">
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
      <Link to={paths.LOGOUT} className="has-text-centered is-uppercase mb-10">
        {t('LOGOUT')}
      </Link>
    </section>
  )
}

export default Menu

const open = (to, history) => () => history.push(to)
