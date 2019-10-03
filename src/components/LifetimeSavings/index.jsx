import React from 'react'
import { useI18n } from '../../shared/i18n'
import { SavingsIcon, InfoIcon } from './Icons'

import './LifetimeSavings.scss'

function LifetimeSavings({ value = 0 }) {
  const t = useI18n()
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  })

  return (
    <div className="lifetime-savings is-flex">
      <div className="icons-container">
        <SavingsIcon className="savings-icon" />
        <InfoIcon className="info-icon" />
      </div>
      <h1 className="is-uppercase lifetime-savings-title">
        {t('LIFETIME_SAVING_TITLE')}
      </h1>
      <h1 className="lifetime-savings-separator">-</h1>
      <h1 className="is-uppercase is-size-3 lifetime-savings-bounty">
        {formatter.format(value)}
      </h1>
    </div>
  )
}

export default LifetimeSavings
