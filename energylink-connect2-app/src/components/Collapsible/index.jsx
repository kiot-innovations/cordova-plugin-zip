import React, { useState } from 'react'
import clsx from 'clsx'
import './Collapsible.scss'

function Collapsible({ icon, title = 'Collapsible Title', actions, children }) {
  const [expand, setExpand] = useState(false)

  const toggle = () => {
    setExpand(!expand)
  }
  const chevron = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="13"
      fill="none"
      viewBox="0 0 25 13"
    >
      <path
        fill="#F7921E"
        d="M23.953 0c-.268 0-.535.098-.74.294L12.5 10.576 1.786.296a1.077 1.077 0 00-1.48 0 .975.975 0 000 1.42l11.454 10.99c.196.188.462.294.74.294.278 0 .544-.106.74-.294L24.693 1.714a.975.975 0 000-1.42 1.066 1.066 0 00-.74-.294z"
      />
    </svg>
  )

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
            {chevron}
          </div>
        </div>
      </div>
      <div
        className={
          expand
            ? 'collapsible-content expanded'
            : 'collapsible-content collapsed'
        }
      >
        {children}
      </div>
    </div>
  )
}

export default Collapsible
