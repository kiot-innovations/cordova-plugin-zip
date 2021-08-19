import { filter, length, propEq, reject } from 'ramda'
import React, { useState } from 'react'
import BlockUI from 'react-block-ui'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import 'react-block-ui/style.css'
import Collapsible from 'components/Collapsible'
import { Loader } from 'components/Loader'
import useModal from 'hooks/useModal'
import SNManualEntry from 'pages/SNList/SNManualEntry'
import SNScanButtons from 'pages/SNList/SNScanButtons'
import paths from 'routes/paths'
import { useI18n } from 'shared/i18n'
import { either } from 'shared/utils'
import { PUSH_CANDIDATES_INIT } from 'state/actions/devices'
import { UPDATE_MI_COUNT } from 'state/actions/inventory'
import { REMOVE_SN, START_DISCOVERY_INIT } from 'state/actions/pvs'
import { discoveryTypes } from 'state/reducers/devices'
import './RMASnList.scss'

const sortSNList = (list, createSnItem) =>
  list
    ? list
        .sort(function(a, b) {
          return a.serial_number > b.serial_number
        })
        .map(device => createSnItem(device.serial_number))
    : []

function RMASnList() {
  const t = useI18n()
  const dispatch = useDispatch()
  const history = useHistory()
  const { canAccessScandit } = useSelector(state => state.global)

  const { serialNumbers, fetchingSN, serialNumbersError } = useSelector(
    state => state.pvs
  )

  const isExistingSN = propEq('existing', true)
  const serialNumbersExisting = filter(isExistingSN, serialNumbers)
  const serialNumbersNew = reject(isExistingSN, serialNumbers)

  const [editingSn, setEditingSn] = useState('')
  const { bom } = useSelector(state => state.inventory)

  const modulesOnInventory = bom.filter(item => {
    return item.item === 'AC_MODULES'
  })
  const expectedMICount = modulesOnInventory[0].value
  const scannedMICount = length(serialNumbersNew)

  const onScanMore = () => {
    history.push(paths.PROTECTED.SCAN_LABELS.path)
  }

  const handleEditSN = serialNumber => {
    setEditingSn(serialNumber)
  }

  const handleRemoveSN = serialNumber => {
    dispatch(REMOVE_SN(serialNumber))
  }

  const afterEditCallback = () => {
    setEditingSn('')
    dispatch(REMOVE_SN(editingSn))
  }

  const createSnItem = (serialNumber, withDelete = true, withEdit = true) => {
    return (
      <div key={serialNumber} className="sn-item mt-10 mb-10 pb-5">
        <span
          className="is-uppercase has-text-weight-bold has-text-white"
          onClick={() => (withEdit ? handleEditSN(serialNumber) : null)}
        >
          {serialNumber}
        </span>
        {withDelete && (
          <button
            onClick={() => handleRemoveSN(serialNumber)}
            className="has-text-white is-size-6"
          >
            <i className="sp-close" />
          </button>
        )}
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
    dispatch(UPDATE_MI_COUNT(serialNumbers.length))
    dispatch(PUSH_CANDIDATES_INIT(snList))
    history.push(paths.PROTECTED.RMA_MI_DISCOVERY.path)
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
        type: discoveryTypes.LEGACY,
        KeepDevices: '1'
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
      history.push(paths.PROTECTED.RMA_MI_DISCOVERY.path)
    }
  }

  const serialNumbersNewList = sortSNList(serialNumbersNew, createSnItem)
  const serialNumbersExistingList = sortSNList(
    serialNumbersExisting,
    createSnItem
  )

  const total = length(serialNumbersExistingList) + length(serialNumbersNewList)

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
            {either(total > 0, t('FOUND_SN', total))}
          </span>
        </div>
        <div className="flex-inverter-list">
          <Collapsible
            title={t('NEW_INVERTERS')}
            actions={
              <span className="is-secondary has-no-border">
                {length(serialNumbersNewList)}
              </span>
            }
          >
            <div className="rma-sn">
              <div className="rma-sn-list mb-10">
                {either(
                  length(serialNumbersNewList) > 0,
                  <>
                    <span className="has-text-weight-bold">
                      {t('TAP_SN_TO_EDIT')}
                    </span>
                    {serialNumbersNewList}
                  </>,
                  <span>{t('SCAN_HINT')}</span>
                )}
                {fetchingSN && <Loader />}
              </div>
              <SNManualEntry
                serialNumber={editingSn}
                callback={afterEditCallback}
              />
            </div>
          </Collapsible>
          <div className="mt-20" />
          <Collapsible
            title={t('EXISTING_INVERTERS')}
            actions={
              <span className="is-secondary has-no-border">
                {length(serialNumbersExistingList)}
              </span>
            }
          >
            <div className="rma-sn">
              <div className="rma-sn-list">
                {either(
                  length(serialNumbersExistingList) > 0,
                  serialNumbersExistingList,
                  <span>{t('SCAN_HINT')}</span>
                )}
                {fetchingSN ? <Loader /> : ''}
              </div>
            </div>
          </Collapsible>
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

export default RMASnList
