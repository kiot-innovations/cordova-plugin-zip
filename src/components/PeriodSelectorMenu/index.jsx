import React, { Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import clsx from 'clsx'
import OverlayModalLayout from '../OverlayModalLayout'
import { TOGGLE_MODAL } from '../../state/actions/modal'
import { ChevronIcon } from './Icons'

import './PeriodSelectorMenu.scss'

function openModal(dispatch, modalId) {
  return () => dispatch(TOGGLE_MODAL({ isActive: true, modalId }))
}

function optionClicked(dispatch, callback, setSelectedOpt, option) {
  return () => {
    dispatch(TOGGLE_MODAL({ isActive: false }))
    setSelectedOpt(option)
    callback(option)
  }
}

function PeriodSelectorMenu({
  header,
  className,
  options = [],
  onClick = () => {},
  modalId
}) {
  const dispatch = useDispatch()
  const { intervalDelta } = useSelector(state => state.history)
  const selected =
    options.find(({ value }) => value === intervalDelta) || options[0]
  return (
    <Fragment>
      <div className="period-selector">
        <h1 className="is-uppercase" onClick={openModal(dispatch, modalId)}>
          {selected ? selected.text : null}
        </h1>
        <ChevronIcon
          className="chevronDown"
          onClick={openModal(dispatch, modalId)}
        />
      </div>
      <OverlayModalLayout id={modalId} header={header} className={className}>
        <div className="modal-select-options">
          {options.length &&
            options.map(o => {
              const className = clsx('modal-option', 'date-option', 'is-flex', {
                disabled: o.disabled
              })

              return (
                <div
                  key={o.id}
                  className={className}
                  onClick={
                    o.disabled
                      ? () => {}
                      : optionClicked(dispatch, onClick, onClick, o)
                  }
                >
                  {o.text && (
                    <Fragment>
                      <span className="option-text pt-15 pb-15 pl-10 pr-10">
                        {o.text}
                      </span>
                    </Fragment>
                  )}
                </div>
              )
            })}
        </div>
      </OverlayModalLayout>
    </Fragment>
  )
}

export default PeriodSelectorMenu
