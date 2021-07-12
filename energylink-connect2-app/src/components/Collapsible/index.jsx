import clsx from 'clsx'
import React, { useState } from 'react'

import { useI18n } from 'shared/i18n'
import './Collapsible.scss'
import { either } from 'shared/utils'

function Collapsible({
  icon,
  title = 'Collapsible Title',
  actions,
  children,
  expanded = false,
  className = '',
  wordBreak = false,
  required = false
}) {
  const t = useI18n()
  const [expand, setExpand] = useState(expanded)

  const toggle = () => {
    setExpand(!expand)
  }

  return (
    <div className="collapsible">
      <div className="collapsible-header" onClick={toggle}>
        <div className="collapsible-title">
          <span>{icon}</span>
          <span className="has-text-weight-bold">{t(title)}</span>
          {either(
            required && !expand,
            <span className="ml-10 has-text-danger">*</span>
          )}
        </div>
        <div
          className={clsx('collapsible-actions', { 'break-word': wordBreak })}
        >
          {actions}
        </div>
        <div className="collapsible-trigger">
          <div className={clsx({ chevron: true, down: expand })}>
            <span className="sp-chevron-up" />
          </div>
        </div>
      </div>
      <div
        className={clsx(className, 'collapsible-content', {
          expanded: expand,
          collapsed: !expand
        })}
      >
        {children}
      </div>
    </div>
  )
}

export default Collapsible
