import React, { useState, useEffect } from 'react'
import { useI18n } from 'shared/i18n'
import { decodeQRData, scanBarcodes } from 'shared/scanning'
import { clearPVSErr, PVS_CONNECTION_INIT } from 'state/actions/network'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import paths from 'routes/paths'
import { saveSerialNumber } from 'state/actions/pvs'
import './ConnectToPVS.scss'
import { Loader } from '../../components/Loader'

const onSuccess = (setScanning, generatePassword, dispatch, t) => data => {
  try {
    setScanning(false)
    let wifiData

    try {
      wifiData = decodeQRData(data)
    } catch {
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

  const onFail = err => {
    alert(err)
  }

  useEffect(() => {
    if (!connectionState.connecting && connectionState.connected) {
      history.push(paths.PROTECTED.PVS_CONNECTION_SUCCESS.path)
    }
    if (!connectionState.connecting && connectionState.err) {
      dispatch(clearPVSErr())
      alert(t('PVS_CONN_ERROR'))
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
        <div className="qr-icon">
          <i className="sp-qr has-text-white" />
        </div>
      )}
      <div className="mt-20 mb-20 pr-20 pl-20">
        <span className="is-size-6 has-text-centered">
          {connectionState.connecting ? t('CONNECTING_PVS') : t('QRCODE_HINT')}
        </span>
      </div>
      <div className="pt-20">
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
  )
}

export default ConnectToPVS
