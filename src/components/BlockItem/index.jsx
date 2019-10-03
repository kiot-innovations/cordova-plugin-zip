import React, { Fragment } from 'react'
import clsx from 'clsx'
import { Link } from 'react-router-dom'

import './BlockItem.scss'

const BlockContent = ({ icon, title, label = null, labelState = 'error' }) => {
  return (
    <Fragment>
      <div className="icon-container is-flex">{icon}</div>
      <h3 className="block-title">{title}</h3>
      {label && <span className={`block-label ${labelState}`}>{label}</span>}
    </Fragment>
  )
}

function BlockItem({
  title,
  icon,
  location = null,
  to = null,
  label = null,
  labelState = 'error',
  className = '',
  size = 'half'
}) {
  return to ? (
    <Link
      to={{
        pathname: to,
        state: {
          from: location && location.pathname
        }
      }}
      className={clsx('modal-block-item is-flex', size + '-width', className)}
    >
      <BlockContent
        title={title}
        icon={icon}
        label={label}
        labelState={labelState}
      />
    </Link>
  ) : (
    <div className={clsx('modal-block-item is-flex', className)}>
      <BlockContent
        title={title}
        icon={icon}
        label={label}
        labelState={labelState}
      />
    </div>
  )
}

export default BlockItem
