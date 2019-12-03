import React from 'react'
import { useI18n } from 'shared/i18n'

function ConnectToPVS() {
  const t = useI18n()

  return (
    <div className="is-vertical has-text-centered">
      <span className="is-uppercase has-text-weight-bold mb-40">
        {t('LOOK_FOR_QR')}
      </span>
      <div className="cam-viewfinder" />
    </div>
  )
}

export default ConnectToPVS
