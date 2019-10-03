import React, { Fragment, useState } from 'react'
import { useDispatch } from 'react-redux'
import clsx from 'clsx'
import OverlayModalLayout from '../OverlayModalLayout'
import { TOGGLE_MODAL } from '../../state/actions/modal'
import { ChevronIcon } from './Icons'

import './ModalSelect.scss'

const createOpenModalClickHandler = (dispatch, modalId, disabled) => () => {
  if (disabled) return
  dispatch(TOGGLE_MODAL({ isActive: true, modalId }))
}

const optionClicked = (dispatch, callback, setSelectedOpt, option) => {
  return () => {
    dispatch(TOGGLE_MODAL({ isActive: false }))
    setSelectedOpt(option)
    callback(option)
  }
}

const ModalSelect = ({
  header,
  className,
  disabled,
  options = [],
  onClick = () => {},
  footer = null,
  textSeparator = '-',
  modalId
}) => {
  const dispatch = useDispatch()
  const selected = options.find(({ selected }) => selected) || options[0] || {}
  const [selectedOpt, setSelectedOpt] = useState(selected)
  const classes = clsx('modal-select', 'is-flex', 'pr-20', 'pl-20', {
    disabled
  })
  return (
    <Fragment>
      <div
        className={classes}
        onClick={createOpenModalClickHandler(dispatch, modalId, disabled)}
      >
        {selectedOpt.textLeft && (
          <Fragment>
            <span className="text-left">{selectedOpt.textLeft}</span>
            <span className="pl-5 pr-5">{textSeparator}</span>
          </Fragment>
        )}
        <span className="text">{selectedOpt.text}</span>
        <ChevronIcon className="chevron" />
      </div>
      <OverlayModalLayout id={modalId} header={header} className={className}>
        <div className="modal-select-options">
          {options.length &&
            options.map(o => {
              return (
                <div
                  key={o.id}
                  className="modal-option pr-20 pl-20 is-flex"
                  onClick={optionClicked(dispatch, onClick, setSelectedOpt, o)}
                >
                  {o.textLeft && (
                    <Fragment>
                      <span className="text-left">{o.textLeft}</span>
                      <span className="pl-5 pr-5">{textSeparator}</span>
                    </Fragment>
                  )}
                  <span className="text">{o.text}</span>
                </div>
              )
            })}
        </div>
        {footer}
      </OverlayModalLayout>
    </Fragment>
  )
}

export default ModalSelect
