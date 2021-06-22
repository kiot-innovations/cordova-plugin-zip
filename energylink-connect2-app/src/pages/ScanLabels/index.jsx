import React, { useEffect, useRef } from 'react'
import { compose, identity, ifElse, map, prop, startsWith } from 'ramda'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useI18n } from 'shared/i18n'
import { scanAR } from 'shared/scandit'
import { buildSN, snEntryMethods } from 'shared/utils'
import { ADD_PVS_SN } from 'state/actions/pvs'
import { rmaModes } from 'state/reducers/rma'
import paths from 'routes/paths'

import './ScanLabels.scss'

const addSN = dispatch =>
  compose(
    ifElse(
      compose(startsWith('E'), prop('serial_number')),
      compose(dispatch, ADD_PVS_SN),
      identity
    ),
    buildSN(snEntryMethods.SCAN)
  )
const addCodes = compose(map, addSN)
const scanMatrix = compose(scanAR, addCodes)

const startScanning = dispatch => {
  if (window.Scandit) return scanMatrix(dispatch)
}

function ScanDeviceLabels() {
  const t = useI18n()
  const dispatch = useDispatch()
  const history = useHistory()
  const { serialNumbers } = useSelector(state => state.pvs)
  const { rmaMode } = useSelector(state => state.rma)

  const onDone = useRef(null)

  const turnOffScandit = () => {
    if (typeof onDone.current === 'function') {
      onDone.current()
    }
  }

  const finishedScanning = () => {
    const redirectTo =
      rmaMode !== rmaModes.REPLACE_PVS
        ? paths.PROTECTED.SN_LIST.path
        : paths.PROTECTED.RMA_SN_LIST.path
    history.push(redirectTo)
  }

  useEffect(() => {
    onDone.current = startScanning(dispatch)
    return turnOffScandit
  }, [dispatch])

  return (
    <div className="scan-labels is-vertical has-text-centered pl-10 pr-10">
      <span className="is-uppercase has-text-weight-bold mb-10">
        {t('SCAN_EQUIPMENT')}
      </span>

      <div id="scandit" />

      <div className="hint-text mt-15 pl-15 pr-15">{t('BULK_SCAN_HINT')}</div>

      <div className="has-text-white mt-10">
        {t('FOUND_SN', serialNumbers.length)}
      </div>

      <button
        className="button is-primary is-uppercase trigger-scan mt-15"
        onClick={finishedScanning}
      >
        {t('DONE')}
      </button>

      <button
        className="button has-text-centered is-uppercase is-secondary has-no-border"
        onClick={finishedScanning}
      >
        {t('SN_MANUAL_ENTRY')}
      </button>
    </div>
  )
}

export default ScanDeviceLabels
