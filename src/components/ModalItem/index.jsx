import React from 'react'
import clsx from 'clsx'
import './ModalItem.scss'

function ModalItem({
  overtitle = null,
  overtitleAlign = null,
  className = '',
  paddingLeft = 'pl-10',
  paddingRight = 'pr-10',
  title,
  children
}) {
  const classes = clsx('modal-item', 'content', className)
  const headerClasses = clsx(
    'subtitle',
    'is-spaced',
    'is-6',
    overtitleAlign || 'has-text-centered center'
  )
  const contentClasses = clsx('content', paddingLeft, paddingRight)
  return (
    <div className={classes}>
      {overtitle && <h3 className={headerClasses}>{overtitle}</h3>}
      {title && (
        <React.Fragment>
          <h2 className="title is-uppercase has-text-centered pl-20 pr-20 is-6">
            {title}
          </h2>
          <div className="modal-separator"></div>
        </React.Fragment>
      )}
      <div className={contentClasses}>{children}</div>
    </div>
  )
}

export default ModalItem
