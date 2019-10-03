import React from 'react'
import clsx from 'clsx'
import moment from 'moment'
import { useDispatch } from 'react-redux'
import { ALERTS_DISMISS } from '../../state/actions/alerts'
import { useI18n } from '../../shared/i18n'
import '../ModalItem/ModalItem.scss'
import './ModalNotification.scss'

function ModalNotification({
  date = moment(),
  id,
  children,
  removable = true
}) {
  const dispatch = useDispatch()
  const t = useI18n()
  const dateString = date.format('MM/DD/YYYY')
  const timeString = date.format('hh:mmA')
  const classNames = clsx(
    'description',
    'content',
    'has-text-centered',
    'pl-15',
    'pr-15',
    removable || 'mb-30'
  )

  return (
    <div className="modal-item modal-notification content">
      <header className="content is-flex">
        <div className="date has-text-left">{dateString}</div>
        <div className="time has-text-right">{timeString}</div>
      </header>
      <div className={classNames}>{children}</div>
      {removable ? (
        <div className="modal-footer content is-flex">
          <button
            className="button is-light remove-button"
            onClick={() => dispatch(ALERTS_DISMISS(id))}
          >
            {t('REMOVE')}
          </button>
        </div>
      ) : null}
    </div>
  )
}

export default ModalNotification
