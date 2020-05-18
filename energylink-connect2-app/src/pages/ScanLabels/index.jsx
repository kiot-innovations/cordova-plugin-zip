import React, { useEffect, useRef } from 'react'
import { compose, map } from 'ramda'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useI18n } from 'shared/i18n'
import { scanM } from 'shared/scandit'
import { buildSN } from 'shared/utils'
import { ADD_PVS_SN } from 'state/actions/pvs'
import paths from 'routes/paths'

import './ScanLabels.scss'

const addSN = dispatch => compose(dispatch, ADD_PVS_SN, buildSN)
const addCodes = compose(map, addSN)
const scanMatrix = compose(scanM, addCodes)
const startScanning = dispatch => {
  if (window.Scandit) return scanMatrix(dispatch)
}

function ScanDeviceLabels() {
  const t = useI18n()
  const dispatch = useDispatch()
  const history = useHistory()
  const { serialNumbers } = useSelector(state => state.pvs)

  const onDone = useRef(null)

  const finishedScanning = () => {
    if (typeof onDone.current === 'function') {
      onDone.current()
      history.push(paths.PROTECTED.SN_LIST.path)
    }
  }

  const triggerManualEntry = () => {
    history.push({
      pathname: paths.PROTECTED.SN_LIST.path,
      state: {
        isManualModeDefault: true
      }
    })
  }

  useEffect(() => {
    onDone.current = startScanning(dispatch)
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
        className="button is-primary trigger-scan mt-15"
        onClick={finishedScanning}
      >
        {t('DONE')}
      </button>

      <button
        className="button has-text-centered is-uppercase is-secondary has-no-border"
        onClick={triggerManualEntry}
      >
        {t('SN_MANUAL_ENTRY')}
      </button>
    </div>
  )
}

export default ScanDeviceLabels
