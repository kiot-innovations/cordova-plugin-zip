import React, { useState } from 'react'
import clsx from 'clsx'
import './Collapsible.scss'

function Collapsible({
  icon,
  title = 'Collapsible Title',
  actions,
  children,
  expanded = false,
  expandable = true
}) {
  const [expand, setExpand] = useState(expanded)

  const toggle = () => {
    setExpand(!expand)
  }

  return (
    <div className="collapsible mb-10">
      <div className="collapsible-header">
        <div className="collapsible-title">
          <span>{icon}</span>
          <span>{title}</span>
        </div>
        <div className="collapsible-actions">{actions}</div>
        {expandable && (
          <div className="collapsible-trigger">
            <div
              className={clsx({ chevron: true, down: expand })}
              onClick={toggle}
            >
              <span className="sp-chevron-up" />
            </div>
          </div>
        )}
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
