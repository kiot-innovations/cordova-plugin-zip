import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useI18n } from 'shared/i18n'
import { GET_SN_INIT, REMOVE_SN } from 'state/actions/pvs'
import { UPDATE_MI_COUNT } from 'state/actions/inventory'
import paths from 'routes/paths'
import useModal from 'hooks/useModal'
import BlockUI from 'react-block-ui'
import './SNList.scss'
import 'react-block-ui/style.css'

function SNList({ animationState }) {
  const t = useI18n()
  const dispatch = useDispatch()
  const history = useHistory()
  const [openingCamera, setOpeningCamera] = useState(false)
  const { serialNumbers, fetchingSN } = useSelector(state => state.pvs)
  const { bom } = useSelector(state => state.inventory)
  const expectedMICount = bom.MODULES
  const scannedMICount = serialNumbers.length

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

  const submitSN = () => {
    toggleModal()
    dispatch(UPDATE_MI_COUNT(serialNumbers.length))
    history.push(paths.PROTECTED.DEVICES.path)
  }

  const snModalContent = text => {
    return (
      <div className="sn-modal">
        <span className="has-text-white mb-10">{text}</span>
        <div className="sn-buttons">
          <button
            className="button half-button-padding is-secondary trigger-scan mr-10"
            onClick={() => toggleModal()}
          >
            {t('CANCEL')}
          </button>
          <button
            className="button half-button-padding is-primary trigger-scan"
            onClick={submitSN}
          >
            {t('CONTINUE')}
          </button>
        </div>
      </div>
    )
  }

  const modalContent =
    scannedMICount > expectedMICount
      ? snModalContent(t('MI_OVERCOUNT', scannedMICount, expectedMICount))
      : snModalContent(t('MI_UNDERCOUNT', scannedMICount, expectedMICount))

  const modalTitle = (
    <span className="has-text-white has-text-weight-bold">
      {t('ATTENTION')}
    </span>
  )

  const { modal, toggleModal } = useModal(
    animationState,
    modalContent,
    modalTitle,
    false
  )

  const countSN = () => {
    if (parseInt(scannedMICount, 10) === parseInt(expectedMICount, 10)) {
      history.push(paths.PROTECTED.DEVICES.path)
    } else {
      toggleModal()
    }
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
      {modal}
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
        {fetchingSN ? (
          ''
        ) : (
          <Link
            to={paths.PROTECTED.SCAN_LABELS.path}
            className="has-text-centered is-uppercase"
          >
            {t('SN_MANUAL_ENTRY')}
          </Link>
        )}
      </div>
    </BlockUI>
  )
}

export default SNList
