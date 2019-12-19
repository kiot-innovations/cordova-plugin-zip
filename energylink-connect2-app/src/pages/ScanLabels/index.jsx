import React, { useState } from 'react'
import { useI18n } from 'shared/i18n'
import { Link } from 'react-router-dom'
import { BarcodeIcon } from './assets'
import paths from 'routes/paths'
import BlockUI from 'react-block-ui'
import 'react-block-ui/style.css'
import './ScanLabels.scss'

function ScanLabels() {
  const t = useI18n()
  const [openingCamera, setOpeningCamera] = useState(false)

  const cameraSuccess = () => {
    setOpeningCamera(false)
    alert('Pic taken')
  }

  const cameraError = () => {
    setOpeningCamera(false)
    alert('Pic not taken')
  }

  const cameraOptions = {
    quality: 100
  }

  const takePicture = () => {
    if (navigator) {
      setOpeningCamera(true)
      navigator.camera.getPicture(cameraSuccess, cameraError, cameraOptions)
    }
  }

  return (
    <BlockUI tag="div" blocking={openingCamera} message={t('OPENING_CAMERA')}>
      <div className="scan-labels is-vertical has-text-centered">
        <span className="is-uppercase has-text-weight-bold">
          {t('SCAN_EQUIPMENT')}
        </span>
        <div className="barcode-icon">
          <BarcodeIcon />
        </div>
        <span className="hint-text">{t('BULK_SCAN_HINT')}</span>
        <button
          className="button is-primary trigger-scan"
          onClick={() => takePicture()}
        >
          {t('BULK_SCAN')}
        </button>
        <Link
          to={paths.PROTECTED.SCAN_LABELS.path}
          className="has-text-centered is-uppercase"
        >
          {t('CANT_FIND_INVERTERS')}
        </Link>
      </div>
    </BlockUI>
  )
}

export default ScanLabels
