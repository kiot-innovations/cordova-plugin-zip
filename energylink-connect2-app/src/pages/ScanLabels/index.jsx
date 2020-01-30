import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useI18n } from 'shared/i18n'
import { Link, useHistory } from 'react-router-dom'
import { BarcodeIcon } from './assets'
import paths from 'routes/paths'
import './ScanLabels.scss'
import { GET_SN_INIT } from 'state/actions/pvs'

function ScanLabels({ animationState }) {
  const t = useI18n()
  const dispatch = useDispatch()
  const history = useHistory()
  const [openingCamera, setOpeningCamera] = useState(false)

  const { serialNumbers, fetchingSN } = useSelector(state => state.pvs)

  const cameraSuccess = photo => {
    setOpeningCamera(false)
    dispatch(GET_SN_INIT(photo))
  }

  const cameraError = () => {
    setOpeningCamera(false)
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

  useEffect(() => {
    if (serialNumbers.length > 0 && animationState !== 'leave') {
      history.push(paths.PROTECTED.SN_LIST.path)
    }
  })

  return (
    <div className="scan-labels is-vertical has-text-centered pl-10 pr-10">
      <span className="is-uppercase has-text-weight-bold">
        {t('SCAN_EQUIPMENT')}
      </span>
      <div className="hold-state">
        {!fetchingSN && !openingCamera ? (
          <BarcodeIcon />
        ) : (
          <div>
            <div className="custom-loader">
              <div className="loader-inner line-scale-pulse-out-rapid">
                <div /> <div /> <div /> <div /> <div />
              </div>
            </div>
            <span className="hint-text">
              {t(openingCamera ? 'OPENING_CAMERA' : 'FETCHING_SN')}
            </span>
          </div>
        )}
      </div>
      {!fetchingSN ? (
        <span className="hint-text">{t('BULK_SCAN_HINT')}</span>
      ) : (
        ''
      )}

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
  )
}

export default ScanLabels
