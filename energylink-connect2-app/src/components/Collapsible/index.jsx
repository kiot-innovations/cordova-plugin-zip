import React, { useState } from 'react'
import clsx from 'clsx'
import './Collapsible.scss'

function Collapsible({
  icon,
  title = 'Collapsible Title',
  actions,
  children,
  expanded = false
}) {
  const [expand, setExpand] = useState(expanded)

  const toggle = () => {
    setExpand(!expand)
  }

  return (
    <div className="collapsible">
      <div className="collapsible-header">
        <div className="collapsible-title">
          <span>{icon}</span>
          <span>{title}</span>
        </div>
        <div className="collapsible-actions">{actions}</div>
        <div className="collapsible-trigger">
          <div
            className={clsx({ chevron: true, down: expand })}
            onClick={toggle}
          >
            <span className="sp-chevron-up" />
          </div>
        </div>
      </div>
      <div
        className={clsx(
          'collapsible-content',
          expand ? 'expanded' : 'collapsed'
        )}
      >
        {children}
      </div>
    </div>
  )
}

export default Collapsible
