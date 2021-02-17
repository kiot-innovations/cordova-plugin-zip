import React from 'react'
import './ButtonLink.scss'

export const ButtonLink = ({ title = 'Link Title', onClick }) => {
  return (
    <div className="button-link mt-10 mb-10" onClick={onClick}>
      <div className="route-name">
        <span>{title}</span>
      </div>
      <div className="arrow-right pt-2">
        <span className="sp-chevron-right has-text-primary" />
      </div>
    </div>
  )
}
