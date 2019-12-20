import React from 'react'
import clsx from 'clsx'

import './Modal.scss'

function Modal({
  display = false,
  title,
  children,
  close,
  dismissable = true
}) {
  return (
    <div className={clsx('modal', { 'is-active': display })}>
      <div className="modal-background" />
      <div className="modal-content">
        {dismissable ? (
          <button
            onClick={close}
            className="modal-close is-medium"
            aria-label="close"
          />
        ) : (
          ''
        )}
        <div className="modal-bar">
          <div className="modal-title mb-15">{title}</div>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}

export default Modal
