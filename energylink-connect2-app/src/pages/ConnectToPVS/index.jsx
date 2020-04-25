/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { map, isEmpty, equals } from 'ramda'
import { useI18n } from 'shared/i18n'
import { scanSimple } from 'shared/scandit'
import { decodeQRData } from 'shared/scanning'
import {
  clearPVSErr,
  PVS_CONNECTION_ERROR,
  PVS_CONNECTION_INIT
} from 'state/actions/network'
import { saveSerialNumber } from 'state/actions/pvs'
import { Loader } from '../../components/Loader'

import paths from 'routes/paths'

import './ConnectToPVS.scss'

const onSuccess = (doneScanning, generatePassword, dispatch, t) => data => {
  try {
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

      doneScanning()
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

  const { connecting, connected, err } = useSelector(state => state.network)
  const [scanning, setScanning] = useState(true)

  const generatePassword = serialNumber => {
    let lastIndex = serialNumber.length
    let password =
      serialNumber.substring(2, 6) +
      serialNumber.substring(lastIndex - 4, lastIndex)
    return password
  }

  const onDone = useRef(null)

  const stopScanning = shouldGoBack => () => {
    if (typeof onDone.current === 'function') {
      onDone.current()
      setScanning(false)
    }
    if (shouldGoBack) history.goBack()
  }

  const processQRCode = map(
    onSuccess(stopScanning(), generatePassword, dispatch, t)
  )

  const startScanning = () => {
    if (window.Scandit) {
      onDone.current = scanSimple(processQRCode)
    }
    if (!scanning) setScanning(true)
  }

  useEffect(() => {
    if (
      !connected &&
      !connecting &&
      !isEmpty(err) &&
      !equals('CANCELED', err)
    ) {
      dispatch(clearPVSErr())
      alert(t('PVS_CONN_ERROR'))
    }

    if (connected && !connecting && isEmpty(err)) {
      stopScanning()
      history.push(paths.PROTECTED.PVS_CONNECTION_SUCCESS.path)
    }
  }, [connected, connecting, err])

  useEffect(() => {
    startScanning()

    return () => {
      if (typeof onDone.current === 'function') stopScanning()
      if (connecting) {
        dispatch(PVS_CONNECTION_ERROR('CANCELED'))
        dispatch(clearPVSErr())
      }
    }
  }, [dispatch])

  return (
    <div className="qr-layout has-text-centered">
      <span className="is-uppercase has-text-weight-bold mt-10">
        {t('LOOK_FOR_QR')}
      </span>
      {connecting ? (
        <Loader />
      ) : scanning ? (
        <div id="scandit" />
      ) : (
        <div className="qr-icon">
          <i className="sp-qr has-text-white" />
        </div>
      )}
      <div className="pt-20">
        <button
          disabled={connecting}
          className="button is-primary"
          onClick={scanning ? stopScanning(true) : startScanning}
        >
          {connecting
            ? t('CONNECTING')
            : scanning
            ? t('STOP_SCAN')
            : t('START_SCAN')}
        </button>
      </div>
    </div>
  )
}

export default ConnectToPVS
