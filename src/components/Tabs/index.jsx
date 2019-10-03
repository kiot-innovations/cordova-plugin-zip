import React from 'react'
import { Link } from 'react-router-dom'
import './Tabs.scss'

function renderTab(tab) {
  return (
    <li key={tab.title} className={tab.active ? 'is-active' : ''}>
      <Link to={tab.url}>{tab.title}</Link>
    </li>
  )
}

function Tabs({ tabs = [] }) {
  return (
    <div className="tabs container is-centered">
      <ul>{tabs.map(renderTab)}</ul>
    </div>
  )
}

export default Tabs
