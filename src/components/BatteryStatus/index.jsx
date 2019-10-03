import React from 'react'
import clsx from 'clsx'
import { useI18n } from '../../shared/i18n'

import './BatteryStatus.scss'

function BatteryStatus({ mode, className = '' }) {
  const t = useI18n()
  const classes = clsx('battery-status', className)

  return (
    <div className={classes}>
      <h2 className="title is-7">{t('BATTERY_STATUS')}:</h2>
      <div className="status-container is-flex">
        <span className="is-active mb-5">{mode}</span>
      </div>
    </div>
  )
}

export default BatteryStatus
