import React, { useState } from 'react'
import BlockUI from 'react-block-ui'
import 'react-block-ui/style.css'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { differenceWith, pathOr } from 'ramda'

import { Loader } from 'components/Loader'
import useModal from 'hooks/useModal'
import paths from 'routes/paths'
import { useI18n } from 'shared/i18n'
import { PUSH_CANDIDATES_INIT } from 'state/actions/devices'
import { UPDATE_MI_COUNT } from 'state/actions/inventory'
import { discoveryTypes } from 'state/reducers/devices'
import { REMOVE_SN, START_DISCOVERY_INIT } from 'state/actions/pvs'

import SNManualEntry from './SNManualEntry'
import SNScanButtons from './SNScanButtons'
import './SNList.scss'

const areEqual = (x, y) => x.SERIAL === y.SERIAL

function SNList() {
  const t = useI18n()
  const dispatch = useDispatch()
  const history = useHistory()

  const { serialNumbers, fetchingSN, serialNumbersError } = useSelector(
    state => state.pvs
  )
  const [editingSn, setEditingSn] = useState('')
  const { bom } = useSelector(state => state.inventory)
  const miFound = useSelector(pathOr([], ['devices', 'miFound']))
  const { canAccessScandit } = useSelector(state => state.global)

  const modulesOnInventory = bom.filter(item => {
    return item.item === 'AC_MODULES'
  })
  const expectedMICount = modulesOnInventory[0].value
  const scannedMICount = serialNumbers.length

  const onScanMore = () => {
    history.push(paths.PROTECTED.SCAN_LABELS.path)
  }

  const handleRemoveSN = serialNumber => {
    dispatch(REMOVE_SN(serialNumber))
  }

  const afterEditCallback = () => {
    setEditingSn('')
    dispatch(REMOVE_SN(editingSn))
  }

  const createSnItem = serialNumber => {
    return (
      <div key={serialNumber} className="sn-item mt-10 mb-10 pb-5">
        <p
          className="is-uppercase has-text-weight-bold has-text-white"
          onClick={() => setEditingSn(serialNumber)}
        >
          {serialNumber}
        </p>
        <button
          onClick={() => handleRemoveSN(serialNumber)}
          className="has-text-white is-paddingless"
        >
          <i className="sp-close is-size-4" />
        </button>
      </div>
    )
  }

  const submitSN = () => {
    const snList = serialNumbers.map(device => ({
      DEVICE_TYPE: 'Inverter',
      SERIAL: device.serial_number
    }))
    serialNumbersError.forEach(snList.push)
    toggleSerialNumbersModal()
    const MisNotClaimedYet = differenceWith(areEqual, snList, miFound)
    dispatch(UPDATE_MI_COUNT(serialNumbers.length))
    dispatch(PUSH_CANDIDATES_INIT(MisNotClaimedYet))
    history.push(paths.PROTECTED.DEVICES.path)
  }

  const serialNumbersModalTemplate = text => {
    return (
      <div className="sn-modal">
        <span className="has-text-white mb-10">{text}</span>
        <div className="sn-buttons">
          <button
            className="button half-button-padding is-secondary is-uppercase trigger-scan mr-10"
            onClick={() => toggleSerialNumbersModal()}
          >
            {t('CANCEL')}
          </button>
          <button
            className="button half-button-padding is-primary is-uppercase trigger-scan"
            onClick={submitSN}
          >
            {t('CONTINUE')}
          </button>
        </div>
      </div>
    )
  }

  const getCountType = (scannedMICount, expectedMICount) => {
    const numExpected = parseInt(expectedMICount)
    const numScanned = parseInt(scannedMICount)

    if (parseInt(numScanned) === 0 && numExpected === 0) return 'MI_NO_COUNT'
    if (numScanned > numExpected) return 'MI_OVERCOUNT'
    return 'MI_UNDERCOUNT'
  }

  const serialNumbersModalContent = serialNumbersModalTemplate(
    t(
      getCountType(scannedMICount, expectedMICount),
      scannedMICount,
      expectedMICount
    )
  )

  const modalsTitle = (
    <span className="has-text-white has-text-weight-bold">
      {t('ATTENTION')}
    </span>
  )

  const startLegacyDiscovery = () => {
    dispatch(
      START_DISCOVERY_INIT({
        Device: 'allplusmime',
        type: discoveryTypes.LEGACY
      })
    )
    history.push(paths.PROTECTED.LEGACY_DISCOVERY.path)
  }

  const legacyDiscoveryModalContent = (
    <div className="sn-modal">
      <span className="has-text-white mb-10">
        {t('LEGACY_DISCOVERY_WARNING')}
      </span>
      <div className="sn-buttons">
        <button
          className="button half-button-padding is-secondary is-uppercase trigger-scan mr-10"
          onClick={() => toggleLegacyDiscoveryModal()}
        >
          {t('CANCEL')}
        </button>
        <button
          className="button half-button-padding is-primary is-uppercase trigger-scan"
          onClick={startLegacyDiscovery}
        >
          {t('CONTINUE')}
        </button>
      </div>
    </div>
  )

  const {
    modal: serialNumbersModal,
    toggleModal: toggleSerialNumbersModal
  } = useModal(serialNumbersModalContent, modalsTitle, false)

  const {
    modal: legacyDiscoveryModal,
    toggleModal: toggleLegacyDiscoveryModal
  } = useModal(legacyDiscoveryModalContent, modalsTitle, false)

  const countSN = () => {
    const parsedScannedMICount = parseInt(scannedMICount)
    const parsedExpectedMiCount = parseInt(expectedMICount)
    if (
      parsedScannedMICount !== parsedExpectedMiCount ||
      (parsedScannedMICount === 0 && parsedExpectedMiCount === 0)
    ) {
      toggleSerialNumbersModal()
    } else {
      submitSN()
      history.push(paths.PROTECTED.DEVICES.path)
    }
  }

  const serialNumbersList = serialNumbers
    ? serialNumbers
        .sort(function(a, b) {
          return a.serial_number > b.serial_number
        })
        .map(device => createSnItem(device.serial_number))
    : []

  return (
    <BlockUI
      tag="div"
      className="snlist-blockui"
      blocking={false}
      message={t('OPENING_CAMERA')}
    >
      {serialNumbersModal}
      {legacyDiscoveryModal}
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
          <div className="sn-list mb-10">
            {serialNumbersList.length > 0 ? (
              <>
                <p className="has-text-weight-bold mb-20">
                  {t('TAP_SN_TO_EDIT')}
                </p>
                {serialNumbersList}
              </>
            ) : (
              <span className="mb-20">{t('SCAN_HINT')}</span>
            )}
          </div>
          <SNManualEntry
            serialNumber={editingSn}
            callback={afterEditCallback}
          />
          {fetchingSN ? <Loader /> : ''}
        </div>

        <div className="sn-buttons">
          <SNScanButtons
            fetchingSN={fetchingSN}
            onScanMore={onScanMore}
            countSN={countSN}
            canScanMore={canAccessScandit}
          />
          <button
            onClick={toggleLegacyDiscoveryModal}
            className="button has-text-centered is-uppercase is-secondary has-no-border pl-0 pr-0"
          >
            {t('LEGACY_DISCOVERY')}
          </button>
        </div>
      </div>
    </BlockUI>
  )
}

export default SNList
