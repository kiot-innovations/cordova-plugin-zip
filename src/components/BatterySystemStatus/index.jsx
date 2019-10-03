import React from 'react'
import { useI18n } from '../../shared/i18n'
import { InternetIcon, OffGridIcon, WarningIcon } from './icons'
import './BatterySystemStatus.scss'

function BatterySystemStatus({ internet, offgrid, warning }) {
  const t = useI18n()
  const internetText = internet
    ? t('INTERNET_CONNECTED')
    : t('INTERNET_DISCONNECTED')

  const modeText = offgrid
    ? t('BATTERY_MODE_OFFGRID')
    : t('BATTERY_MODE_ONGRID')

  return (
    <div className="battery-status is-flex">
      <h1 className="is-uppercase battery-status-desc1 is-size-7">
        STORAGE SYSTEM INFO
      </h1>
      <div className="mt-15 mb-15" />

      <div className="battery-status-item">
        <div className="battery-status-item-icon mt-5 mb-5 mr-10 ml-40">
          <InternetIcon />
        </div>
        <div className="battery-status-item-text">
          <h1 className="is-uppercase is-size-7 ">{t('INTERNET')}:</h1>
          <h1 className="is-uppercase is-size-7">{internetText}</h1>
        </div>
      </div>

      <div className="battery-status-item">
        <div className="battery-status-item-icon mt-5 mb-5 mr-10 ml-40">
          <OffGridIcon />
        </div>
        <div className="battery-status-item-text">
          <h1 className="is-uppercase is-size-7">{t('BATTERY_GRID_MODE')}:</h1>
          <h1 className="is-uppercase is-size-7">{modeText}</h1>
        </div>
      </div>

      {warning ? (
        <div className="battery-status-item">
          <div className="battery-status-item-icon mt-5 mb-5 mr-10 ml-40">
            <WarningIcon />
          </div>
          <div className="battery-status-item-text">
            <h1 className="is-uppercase is-size-7 battery-status-warning">
              {t('BATTERY_WARNING')}
            </h1>
          </div>
        </div>
      ) : (
        ''
      )}

      <div className="mt-15 mb-15" />
    </div>
  )
}

export default BatterySystemStatus
