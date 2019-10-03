import React from 'react'
import clsx from 'clsx'
import { useI18n } from '../../shared/i18n'
import './SwitchButton.scss'

const SwitchButton = ({
  id = 'switch-default',
  text = '',
  className = '',
  hasTextLeft = true,
  input = {}
}) => {
  const classes = clsx('switch', 'is-rounded', className)
  const t = useI18n()
  return (
    <div className="field switch-button">
      {hasTextLeft && text && (
        <span className="switch-button-label">{text}</span>
      )}
      <input {...input} id={id} type="checkbox" className={classes} />
      <label htmlFor={id}>
        <span className="on">{t('ON')}</span>
        <span className="off">{t('OFF')}</span>
      </label>
      {!hasTextLeft && text && <span>{text}</span>}
    </div>
  )
}

export default SwitchButton
