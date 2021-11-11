import clsx from 'clsx'
import React from 'react'
import './ButtonLink.scss'

export const ButtonLink = ({
  title = 'Link Title',
  subtitle,
  icon = 'sp-chevron-right',
  size = 6,
  onClick
}) => {
  return (
    <div className="button-link mt-10 mb-10" onClick={onClick}>
      {subtitle ? (
        <div className="has-text-left">
          <p className="route-name has-text-weight-bold">{title}</p>
          <p>{subtitle}</p>
        </div>
      ) : (
        <div className="has-text-left route-name">
          <span>{title}</span>
        </div>
      )}
      <div className="arrow-right pt-2">
        <span className={clsx([icon, 'has-text-primary', `is-size-${size}`])} />
      </div>
    </div>
  )
}
