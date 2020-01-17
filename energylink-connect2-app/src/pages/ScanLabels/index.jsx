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

function ScanLabels() {
  const t = useI18n()
  const dispatch = useDispatch()
  const [openingCamera, setOpeningCamera] = useState(false)

  const { takenImage, serialNumbers, fetchingSN } = useSelector(
    state => state.pvs
  )

  const cameraSuccess = photo => {
    setOpeningCamera(false)
    dispatch(SET_TAKEN_IMAGE(photo))
    dispatch(GET_SN_INIT(photo))
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
      <div className="scan-labels is-vertical has-text-centered pl-10 pr-10">
        <span className="is-uppercase has-text-weight-bold">
          {t('SCAN_EQUIPMENT')}
        </span>
        <div className="barcode-icon">
          {takenImage ? (
            <img
              src={'data:image/jpeg;base64,' + takenImage}
              alt="Scanned Codes"
            />
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
