import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { compose, map } from 'ramda'
import { useDispatch, useSelector } from 'react-redux'
import { useI18n } from 'shared/i18n'
import { scanM } from 'shared/scandit'
import ErrorBoundary from 'components/Error'
import { ADD_PVS_SN } from 'state/actions/pvs'
import { buildSN } from 'shared/utils'
import paths from 'routes/paths'

import './ScanDeviceLabels.scss'

function ScanDeviceLabels() {
  const t = useI18n()
  const dispatch = useDispatch()
  const history = useHistory()
  const { serialNumbers } = useSelector(state => state.pvs)

  const [isScanning, setIsScanning] = useState(true)
  const onDone = useRef(null)

  const addSN = compose(dispatch, ADD_PVS_SN, buildSN)
  const addCodes = map(addSN)

  const finishedScanning = () => {
    if (typeof onDone.current === 'function') {
      onDone.current()
      setIsScanning(false)
      history.push(paths.PROTECTED.SN_LIST.path)
      console.warn(serialNumbers, 'ON FINISH')
    }
  }

  const startScanning = useCallback(() => {
    if (window.Scandit) onDone.current = scanM(addCodes)
  }, [addCodes])

  useEffect(() => {
    startScanning()

    return () => {
      if (isScanning && onDone.current) {
        onDone.current()
      }
    }
  }, [isScanning, startScanning])

  return (
    <ErrorBoundary>
      <div className="tile is-flex is-vertical has-text-centered page-height scan">
        <span className="is-uppercase has-text-weight-bold mb-40">
          {t('SCAN_MI_LABELS')} {serialNumbers.length}
        </span>
        <div id="scandit" />
        <div className="is-flex auto">
          <button
            className="button is-primary is-uppercase is-center mt-50"
            onClick={finishedScanning}
          >
            {t('DONE')}
          </button>

          <button
            className="button is-primary is-uppercase is-center mt-50"
            onClick={startScanning}
          >
            {t('SCAN')}
          </button>
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default ScanDeviceLabels
