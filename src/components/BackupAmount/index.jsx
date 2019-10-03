import React from 'react'

import { useI18n } from '../../shared/i18n'

import './BackupAmount.scss'

function BackupAmount({ backup = 5 }) {
  const t = useI18n()

  return (
    <div className="backup-amount pr-40 pl-40">
      <div className="backup-amount-top">
        <div className="backup-amount-qty">
          <h1 className="is-size-2 mb-10">{backup}</h1>
          <h1>{t('BACKUP_AMOUNT_UNIT')}</h1>
        </div>
        <div className="backup-amount-text">
          <h1 className="is-uppercase">{t('BACKUP_AMOUNT_TEXT')}</h1>
        </div>
      </div>
    </div>
  )
}

export default BackupAmount
