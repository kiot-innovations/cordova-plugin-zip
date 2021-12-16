import Tile from '@sunpower/tile'
import React from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { useI18n } from 'shared/i18n'
import { either } from 'shared/utils'
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

  return (
    <section className="is-flex tile is-vertical level full-height">
      <article className="menuitems mt-10">
        {items.map(menuItem =>
          either(
            menuItem.display,
            <div className="mb-15 is-flex tile-item" key={menuItem.text}>
              <Tile
                icon={menuItem.icon}
                text={t(menuItem.text)}
                onClick={onClickItem(menuItem)}
              />
            </div>
          )
        )}
      </article>
    </section>
  )
}

export default MenuItemsContainer
