import clsx from 'clsx'
import React from 'react'
import './ButtonLink.scss'

export const ButtonLink = ({
  title = 'Link Title',
  onClick,
  icon = 'sp-chevron-right',
  size = 6
}) => {
  return (
    <div className="button-link mt-10 mb-10" onClick={onClick}>
      <div className="route-name">
        <span>{title}</span>
      </div>
      <div className="arrow-right pt-2">
        <span className={clsx([icon, 'has-text-primary', `is-size-${size}`])} />
      </div>
    </div>
  )
}
