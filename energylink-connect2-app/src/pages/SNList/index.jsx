import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useI18n } from 'shared/i18n'
import paths from 'routes/paths'
import BlockUI from 'react-block-ui'
import 'react-block-ui/style.css'
import './SNList.scss'
import { GET_SN_INIT, REMOVE_SN } from 'state/actions/pvs'
import { Link } from 'react-router-dom'

function SNList() {
  const t = useI18n()
  const dispatch = useDispatch()
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
    destinationType: 1
  }

  const takePicture = () => {
    if (navigator) {
      setOpeningCamera(true)
      navigator.camera.getPicture(cameraSuccess, cameraError, cameraOptions)
    }
  }

  const handleRemoveSN = serialNumber => {
    dispatch(REMOVE_SN(serialNumber))
  }

  const createSnItem = serialNumber => {
    return (
      <div key={serialNumber} className="sn-item mt-10 mb-10 pb-5">
        <span className="is-uppercase has-text-weight-bold has-text-white">
          {serialNumber}
        </span>
        <button
          onClick={() => handleRemoveSN(serialNumber)}
          className="has-text-white is-size-6"
        >
          <i className="sp-trash" />
        </button>
      </div>
    )
  }

  const serialNumbersList = serialNumbers
    ? serialNumbers
        .sort(function(a, b) {
          return a.serial_number > b.serial_number
        })
        .map(device => createSnItem(device.serial_number))
    : []

  const customLoader = () => {
    return (
      <div className="custom-loader">
        <div className="loader-inner line-scale-pulse-out-rapid">
          <div /> <div /> <div /> <div /> <div />
        </div>
      </div>
    )
  }
  return (
    <BlockUI tag="div" blocking={openingCamera} message={t('OPENING_CAMERA')}>
      <div className="snlist is-vertical has-text-centered pl-10 pr-10">
        <div className="top-text">
          <span className="is-uppercase has-text-weight-bold">
            {t('SCAN_MI_LABELS')}
          </span>
          <span className="has-text-white">
            {serialNumbers.length > 0
              ? t('FOUND_SN', serialNumbers.length)
              : ''}
          </span>
        </div>
        <div className="sn-container">
          {serialNumbersList.length > 0 ? (
            serialNumbersList
          ) : (
            <span>{t('SCAN_HINT')}</span>
          )}
          {fetchingSN ? customLoader() : ''}
        </div>
        <button
          className="button is-primary trigger-scan"
          onClick={takePicture}
          disabled={fetchingSN}
        >
          {fetchingSN ? t('SCANNING_SN') : t('SCAN_MORE')}
        </button>
        <Link
          to={paths.PROTECTED.SCAN_LABELS.path}
          className="has-text-centered is-uppercase"
        >
          {t('SN_MANUAL_ENTRY')}
        </Link>
      </div>
    </BlockUI>
  )
}

export default SNList
