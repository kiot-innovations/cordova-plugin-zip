import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown } from './Icons'
import paths from '../../pages/Router/paths'
import { useI18n } from '../../shared/i18n'

import './BatteryMode.scss'

function BatteryMode({ mode = '' }) {
  const t = useI18n()
  return (
    <div className="battery-mode">
      <h2 className="title is-7">{t('BATTERY_MODE')}:</h2>
      <Link
        to={{
          pathname: paths.MENU_BATTERY_SETTINGS,
          state: {
            from: paths.STORAGE
          }
        }}
      >
        <h3 className="subtitle is-7">
          {mode} <ChevronDown />
        </h3>
      </Link>
    </div>
  )
}

export default BatteryMode
