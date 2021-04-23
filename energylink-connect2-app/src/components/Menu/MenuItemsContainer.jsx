import Tile from '@sunpower/tile'
import React from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import paths from 'routes/paths'
import { useI18n } from 'shared/i18n'
import { either, isDebug } from 'shared/utils'
import { MENU_DISPLAY_ITEM, MENU_HIDE } from 'state/actions/ui'

function MenuItemsContainer({ items }) {
  const t = useI18n()
  const dispatch = useDispatch()
  const history = useHistory()

  const onClickItem = item => () => {
    if (item.component) {
      dispatch(MENU_DISPLAY_ITEM(item.text))
    } else {
      dispatch(MENU_HIDE())
      history.push(item.to)
    }
  }

  const goToDebug = () => {
    dispatch(MENU_HIDE())
    history.push(paths.PROTECTED.DEBUG_PAGE.path)
  }

  return (
    <section className="is-flex tile is-vertical level full-height">
      <article className="menuitems mt-15">
        {items.map(menuItem =>
          either(
            menuItem.display,
            <div className="mb-30 is-flex" key={menuItem.text}>
              <Tile
                icon={menuItem.icon}
                text={t(menuItem.text)}
                onClick={onClickItem(menuItem)}
              />
            </div>
          )
        )}
        {isDebug && (
          <div
            className="mb-30 is-flex superuser-options"
            key={t('SUPERUSER_OPTIONS')}
          >
            <Tile
              icon="sp-gear"
              text={t('SUPERUSER_OPTIONS')}
              onClick={goToDebug}
            />
          </div>
        )}
      </article>
    </section>
  )
}

export default MenuItemsContainer
