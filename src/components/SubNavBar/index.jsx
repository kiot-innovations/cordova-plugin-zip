import React from 'react'
import Tabs from '../Tabs'

import './SubNavBar.scss'

function SubNavBar({ tabs = [] }) {
  return (
    <nav
      className="sub-nav-bar navbar"
      role="navigation"
      aria-label="secondary navigation"
    >
      <Tabs tabs={tabs} />
    </nav>
  )
}

export default SubNavBar
