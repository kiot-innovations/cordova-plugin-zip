import React from 'react'
import { useI18n } from 'shared/i18n'

const ScanButtons = ({ fetchingSN, takePicture, countSN }) => {
  const t = useI18n()

  return (
    <div className="sn-buttons">
      <button
        className="button half-button-padding is-secondary trigger-scan mr-10"
        onClick={takePicture}
        disabled={fetchingSN}
      >
        {fetchingSN ? t('SCANNING_SN') : t('SCAN_MORE')}
      </button>
      <button
        className="button half-button-padding is-primary trigger-scan"
        onClick={countSN}
        disabled={fetchingSN}
      >
        {fetchingSN ? t('SCANNING_SN') : t('CONTINUE')}
      </button>
    </div>
  )
}

export default ScanButtons
