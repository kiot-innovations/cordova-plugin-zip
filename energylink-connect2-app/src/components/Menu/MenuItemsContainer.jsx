import React from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import Tile from '@sunpower/tile'
import paths from 'routes/paths'
import { useI18n } from 'shared/i18n'
import { LOGOUT } from 'state/actions/auth'
import { MENU_DISPLAY_ITEM, MENU_HIDE } from 'state/actions/ui'

function MenuItemsContainer({ items }) {
  const t = useI18n()
  const dispatch = useDispatch()
  const history = useHistory()

  const logout = () => {
    history.push(paths.PROTECTED.ROOT.path)
    dispatch(MENU_HIDE())
    dispatch(LOGOUT())
  }

  const onClickItem = item => () => {
    if (item.component) {
      dispatch(MENU_DISPLAY_ITEM(item.text))
    } else {
      dispatch(MENU_HIDE())
      history.push(item.to)
    }
  }

  return (
    <section className="is-flex tile is-vertical level full-height">
      <article className="is-flex space-around flow-wrap mt-15">
        {items.map(menuItem => (
          <div className="mb-30" key={menuItem.text}>
            <Tile
              icon={menuItem.icon}
              text={t(menuItem.text)}
              onClick={onClickItem(menuItem)}
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

export default MenuItemsContainer
