import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { length } from 'ramda'
import SwipeableBottomSheet from 'react-swipeable-bottom-sheet'
import { useI18n } from 'shared/i18n'
import { decodeQRData, scanBarcodes } from 'shared/scanning'
import { PVS_CLEAR_ERROR, PVS_CONNECTION_INIT } from 'state/actions/network'
import { saveSerialNumber } from 'state/actions/pvs'
import { Loader } from 'components/Loader'
import paths from 'routes/paths'
import './ConnectToPVS.scss'

const onSuccess = (setScanning, generatePassword, dispatch, t) => data => {
  try {
    setScanning(false)
    let wifiData

    try {
      wifiData = decodeQRData(data)
    } catch (err) {
      wifiData = ''
    }

    if (wifiData.length > 0) {
      const qrData = wifiData.split('|')
      const [serialNumber, ssid] = qrData
      const password = generatePassword(serialNumber)
      dispatch(saveSerialNumber(serialNumber))
      dispatch(PVS_CONNECTION_INIT({ ssid, password }))
    } else {
      alert(t('INVALID_QRCODE'))
    }
  } catch (error) {
    console.warn(error)
  }
}

function ConnectToPVS() {
  const t = useI18n()
  const dispatch = useDispatch()
  const history = useHistory()
  const connectionState = useSelector(state => state.network)
  const [scanning, setScanning] = useState(false)
  const [manualEntry, showManualEntry] = useState(false)
  const [serialNumber, setSerialNumber] = useState('')

  const onFail = err => {
    alert(err)
  }

  useEffect(() => {
    if (!connectionState.connecting && connectionState.connected) {
      history.push(paths.PROTECTED.PVS_CONNECTION_SUCCESS.path)
    }
    if (!connectionState.connecting && connectionState.err) {
      alert(t('PVS_CONN_ERROR'))
      dispatch(PVS_CLEAR_ERROR())
    }
  }, [
    connectionState.connected,
    connectionState.connecting,
    connectionState.err,
    dispatch,
    history,
    scanning,
    t
  ])

  const manualConnect = () => {
    showManualEntry(false)
    const ssid = generateSSID(serialNumber)
    const password = generatePassword(serialNumber)
    dispatch(saveSerialNumber(serialNumber))
    dispatch(PVS_CONNECTION_INIT({ ssid, password }))
  }

  const generateSSID = serialNumber => {
    const lastIndex = serialNumber.length
    const ssidPt1 = serialNumber.substring(4, 6)
    const ssidPt2 = serialNumber.substring(lastIndex - 3, lastIndex)

    return `SunPower${ssidPt1}${ssidPt2}`
  }

  const generatePassword = serialNumber => {
    let lastIndex = serialNumber.length
    let password =
      serialNumber.substring(2, 6) +
      serialNumber.substring(lastIndex - 4, lastIndex)
    return password
  }

  return (
    <div className="qr-layout has-text-centered">
      <span className="is-uppercase has-text-weight-bold mt-30">
        {t('LOOK_FOR_QR')}
      </span>
      {connectionState.connecting ? (
        <Loader />
      ) : (
        <div className="qr-icon mt-20 mb-20">
          <i className="sp-qr has-text-white" />
        </div>
      )}
      <div className="mt-20 mb-20 pr-20 pl-20">
        <span className="is-size-6 has-text-centered">
          {connectionState.connecting ? t('CONNECTING_PVS') : t('QRCODE_HINT')}
        </span>
        <div className="mt-20">
          <button
            disabled={connectionState.connecting}
            className="button is-primary"
            onClick={() =>
              scanBarcodes(
                onSuccess(setScanning, generatePassword, dispatch, t),
                onFail
              )
            }
          >
            {t('START_SCAN')}
          </button>
        </div>
      </div>

      <div className="mt-30">
        <span>{t('MANUAL_ENTRY_HINT')}</span>
        <div>
          <button
            disabled={connectionState.connecting}
            className="mt-20 button is-primary is-outlined"
            onClick={() => showManualEntry(true)}
          >
            {t('MANUAL_ENTRY')}
          </button>
        </div>
      </div>

      <SwipeableBottomSheet
        shadowTip={false}
        open={manualEntry}
        onChange={() => showManualEntry(!manualEntry)}
      >
        <div className="manual-entry">
          <span className="has-text-weight-bold">{t('PVS_SN')}</span>
          <div className="mt-20 mb-20">
            <input
              type="text"
              placeholder="ZT00000000000000000"
              onChange={event => setSerialNumber(event.target.value)}
            />
          </div>
          <span className="mt-10 mb-10">{t('SERIAL_NUMBER_HINT')}</span>
          <div className="mt-10 mb-20">
            <button
              disabled={length(serialNumber) !== 19}
              className="button is-primary"
              onClick={manualConnect}
            >
              {t('CONNECT')}
            </button>
          </div>
        </div>
      </SwipeableBottomSheet>
    </div>
  )
}

export default ConnectToPVS
