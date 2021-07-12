import clsx from 'clsx'
import { find, path, propEq, propOr } from 'ramda'
import React from 'react'
import { useSelector } from 'react-redux'

import menuItems from './menuItems'
import MenuItemsContainer from './MenuItemsContainer'

import { either } from 'shared/utils'
import './menu.scss'

function Menu() {
  const menuItemToDisplay = useSelector(path(['ui', 'menu', 'itemToDisplay']))
  const show = useSelector(path(['ui', 'menu', 'show']))

  const selectedMenuItem = find(propEq('text', menuItemToDisplay))(menuItems)
  const Component = propOr(null, 'component', selectedMenuItem)

  return (
    <div
      className={clsx('menu-floating', {
        'is-hidden': !show
      })}
    >
      {either(!selectedMenuItem, <MenuItemsContainer items={menuItems} />)}
      {selectedMenuItem && <Component />}
    </div>
  )
}

export default Menu
