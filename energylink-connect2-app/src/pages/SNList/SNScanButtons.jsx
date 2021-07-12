import React from 'react'

import { useI18n } from 'shared/i18n'
import { either } from 'shared/utils'

const ScanButtons = ({ fetchingSN, onScanMore, countSN, canScanMore }) => {
  const t = useI18n()

  return (
    <div className="sn-buttons">
      {either(
        canScanMore,
        <button
          className="button half-button-padding is-secondary is-uppercase trigger-scan mr-10"
          onClick={onScanMore}
          disabled={fetchingSN}
        >
          {fetchingSN ? t('SCANNING_SN') : t('SCAN_MORE')}
        </button>
      )}

      <button
        className="button half-button-padding is-primary is-uppercase trigger-scan"
        onClick={countSN}
        disabled={fetchingSN}
      >
        {fetchingSN ? t('SCANNING_SN') : t('CONTINUE')}
      </button>
    </div>
  )
}

export default ScanButtons
