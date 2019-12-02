import React from 'react'
import { useI18n } from 'shared/i18n'
import QrReader from 'react-qr-reader'

function ConnectToPVS() {
  const t = useI18n()

  const handleScan = data => {
    alert(data)
  }

  const handleError = err => {
    console.error(err)
  }

  return (
    <div className="is-vertical has-text-centered">
      <span className="is-uppercase has-text-weight-bold mb-40">
        {t('LOOK_FOR_QR')}
      </span>
      <div className="cam-viewfinder">
        <QrReader
          delay={1000}
          onScan={handleScan}
          onError={handleError}
          style={{ width: '100%' }}
        />
      </div>
    </div>
  )
}

export default ConnectToPVS
