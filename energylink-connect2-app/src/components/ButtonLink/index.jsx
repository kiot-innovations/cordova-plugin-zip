import React from 'react'
import { useHistory } from 'react-router-dom'
import './ButtonLink.scss'

export const ButtonLink = ({ title = 'Link Title', path }) => {
  const history = useHistory()

  return (
    <div className="button-link mt-10 mb-10" onClick={() => history.push(path)}>
      <div className="route-name">
        <span>{title}</span>
      </div>
      <div className="arrow-right pt-2">
        <span className="sp-chevron-right has-text-primary" />
      </div>
    </div>
  )
}
