import React from 'react'
import { createPortal } from 'react-dom'
import { useDispatch, useSelector } from 'react-redux'
import clsx from 'clsx'
import { usePortal } from './usePortal'
import { TOGGLE_MODAL } from '../../state/actions/modal'

import './OverlayModalLayout.scss'

function closeModal(dispatch) {
  return () => dispatch(TOGGLE_MODAL({ isActive: false }))
}

const Modal = ({ id, header, className, children }) => {
  const dispatch = useDispatch()
  const modal = useSelector(state => state.global && state.global.modal)
  const { modalId, isActive } = modal
  const isModalActive = isActive && modalId === id
  const bodyClasses = clsx('modal-content', 'overlay-modal-layout', className)
  const modalClasses = clsx('modal', { 'is-active': isModalActive })
  return (
    <div className={modalClasses}>
      <div className="modal-background" onClick={closeModal(dispatch)}></div>
      <div className={bodyClasses}>
        <div className="modal-header is-flex">
          <h2>{header}</h2>
        </div>
        <div className="modal-body is-flex">{children}</div>
      </div>
    </div>
  )
}

const OverlayModalLayout = ({
  id = 'modal-root',
  className = 'is-half',
  header,
  children
}) => {
  const target = usePortal(id)
  return createPortal(
    <Modal id={id} header={header} className={className}>
      {children}
    </Modal>,
    target
  )
}

export default OverlayModalLayout
