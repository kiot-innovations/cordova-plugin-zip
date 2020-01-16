import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useI18n } from 'shared/i18n'
import { Link } from 'react-router-dom'
import { BarcodeIcon } from './assets'
import paths from 'routes/paths'
import BlockUI from 'react-block-ui'
import 'react-block-ui/style.css'
import './ScanLabels.scss'
import { GET_SN_INIT, SET_TAKEN_IMAGE } from 'state/actions/pvs'
import { b64toBlob } from 'shared/utils'

function ScanLabels() {
  const t = useI18n()
  const dispatch = useDispatch()
  const [openingCamera, setOpeningCamera] = useState(false)

  const { takenImage, serialNumbers, fetchingSN } = useSelector(
    state => state.pvs
  )

  console.info(serialNumbers, fetchingSN, takenImage)

  const cameraSuccess = photo => {
    setOpeningCamera(false)
    const photoBlob = b64toBlob(photo)
    dispatch(SET_TAKEN_IMAGE(photo))
    dispatch(GET_SN_INIT(photoBlob))
  }

  const cameraError = () => {
    setOpeningCamera(false)
    alert('Pic not taken')
  }

  const cameraOptions = {
    quality: 40,
    sourceType: 1,
    destinationType: 0
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
          {takenImage ? (
            <img src={takenImage} alt="Scanned Codes" />
          ) : (
            <BarcodeIcon />
          )}
        </div>
        <span className="hint-text">{t('BULK_SCAN_HINT')}</span>

        {!fetchingSN && serialNumbers.length > 0 ? (
          <span className="has-text-white">
            {t('FOUND_SN', serialNumbers.length)}
          </span>
        ) : null}

        <button
          className="button is-primary trigger-scan"
          onClick={takePicture}
          disabled={fetchingSN}
        >
          {fetchingSN ? t('SCANNING_SN') : t('BULK_SCAN')}
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
