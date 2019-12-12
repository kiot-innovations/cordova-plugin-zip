import React, { useCallback, useState, useEffect } from 'react'
import ExampleImage from './assets/example.png'
import { useI18n } from 'shared/i18n'
import { decodeQRData, scanBarcodes } from 'shared/scanning'
import { clearPVSErr, connectTo } from 'state/actions/network'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import paths from 'routes/paths'
import { saveSerialNumber } from 'state/actions/pvs'

function ConnectToPVS({ animationState }) {
  const t = useI18n()
  const dispatch = useDispatch()
  const history = useHistory()
  const connectionState = useSelector(state => state.network)
  const [scanning, setScanning] = useState(false)

  const connectToWifi = useCallback(
    (ssid, pwd) => {
      dispatch(connectTo(ssid, pwd))
    },
    [dispatch]
  )

  const onSuccess = useCallback(
    data => {
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
        connectToWifi(ssid, password)
      } else {
        alert(t('INVALID_QRCODE'))
      }
    },
    [dispatch, t, connectToWifi]
  )

  const onFail = err => {
    alert(err)
  }

  useEffect(() => {
    if (!scanning && animationState === 'enter') {
      setScanning(true)
      scanBarcodes(onSuccess, onFail)
    }
    if (
      !connectionState.connecting &&
      connectionState.connected &&
      animationState !== 'leave'
    ) {
      history.push(paths.PROTECTED.PVS_CONNECTION_SUCCESS.path)
    }
    if (!connectionState.connecting && connectionState.err) {
      dispatch(clearPVSErr())
      alert(t('PVS_CONN_ERROR'))
    }
  }, [
    scanning,
    animationState,
    connectionState.connected,
    connectionState.connecting,
    connectionState.err,
    history,
    onSuccess,
    dispatch,
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
    <div className="is-vertical has-text-centered">
      <span className="is-uppercase has-text-weight-bold mb-40">
        {t('LOOK_FOR_QR')}
      </span>
      <div className="example-image mt-20 mb-20">
        <span>{t('EXAMPLE_IMAGE')}</span>
        <img
          className="mt-15"
          src={ExampleImage}
          alt={t('EXAMPLE_QR_IMAGE_ALT')}
        />
      </div>
      <button
        className="button is-primary"
        onClick={() => scanBarcodes(onSuccess, onFail)}
      >
        {t('START_SCAN')}
      </button>
    </div>
  )
}

export default ConnectToPVS
