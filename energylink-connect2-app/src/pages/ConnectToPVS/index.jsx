import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { length, pathOr } from 'ramda'
import SwipeableBottomSheet from 'react-swipeable-bottom-sheet'
import { useI18n } from 'shared/i18n'
import { decodeQRData, scanBarcodes } from 'shared/scanning'
import { generatePassword, generateSSID, isIos } from 'shared/utils'
import {
  PVS_CONNECTION_INIT,
  PVS_TIMEOUT_FOR_CONNECTION,
  OPEN_SETTINGS,
  ENABLE_BLUETOOTH_INIT
} from 'state/actions/network'
import {
  CONNECT_PVS_CAMERA,
  CONNECT_PVS_MANUALLY,
  SCANNING_START
} from 'state/actions/analytics'
import { SAVE_PVS_SN } from 'state/actions/pvs'
import { Loader } from 'components/Loader'
import paths from 'routes/paths'
import './ConnectToPVS.scss'

const onSuccess = (generatePassword, dispatch, t, setStarted) => data => {
  try {
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
      dispatch(SAVE_PVS_SN(serialNumber))
      dispatch(CONNECT_PVS_CAMERA(serialNumber))
      dispatch(PVS_CONNECTION_INIT({ ssid, password }))
    } else {
      alert(t('INVALID_QRCODE'))
    }
  } catch (error) {
    console.warn(error)
  }

  setStarted(false)
}

function ConnectToPVS() {
  const t = useI18n()
  const dispatch = useDispatch()
  const history = useHistory()
  const connectionState = useSelector(state => state.network)
  const { bluetoothEnabled } = useSelector(pathOr({}, ['network']))
  const [manualEntry, showManualEntry] = useState(false)
  const [serialNumber, setSerialNumber] = useState('')
  const [started, setStarted] = useState(false)
  const [enableBle, showEnableBle] = useState(false)

  const onFail = err => {
    alert(err)
    setStarted(false)
  }

  useEffect(() => {
    if (connectionState.connecting) dispatch(PVS_TIMEOUT_FOR_CONNECTION())
  }, [connectionState.connecting, dispatch])

  useEffect(() => {
    if (connectionState.connected) {
      history.push(paths.PROTECTED.PVS_CONNECTION_SUCCESS.path)
    }
  }, [connectionState.connected, dispatch, history])

  useEffect(() => {
    if (bluetoothEnabled) {
      showEnableBle(false)
    }
  }, [bluetoothEnabled])

  const manualConnect = () => {
    showManualEntry(false)
    const ssid = generateSSID(serialNumber)
    const password = generatePassword(serialNumber)
    dispatch(SAVE_PVS_SN(serialNumber))
    dispatch(CONNECT_PVS_MANUALLY(serialNumber))
    dispatch(PVS_CONNECTION_INIT({ ssid, password }))
  }

  const getBarcode = () => {
    setStarted(true)
    dispatch(SCANNING_START())
    scanBarcodes(onSuccess(generatePassword, dispatch, t, setStarted), onFail)
  }

  const enableBluetooth = () => {
    isIos() ? dispatch(OPEN_SETTINGS()) : dispatch(ENABLE_BLUETOOTH_INIT())
  }

  const goToNearbyDevices = () => {
    bluetoothEnabled
      ? history.push(paths.PROTECTED.NEARBY_PVS.path)
      : showEnableBle(true)
  }

  const btPermContent = (
    <div className="has-text-centered is-vertical tile is-flex">
      <div className="mb-10">
        <span className="sp-bth is-size-1 has-text-white" />
      </div>
      <span className="has-text-white mt-10 mb-10">
        {t('BLUETOOTH_PERM_HINT')}
      </span>
      <div className="has-text-centered">
        <button className="button is-primary" onClick={enableBluetooth}>
          {t(isIos() ? 'PERM_SETTINGS' : 'ENABLE_BLE')}
        </button>
      </div>
    </div>
  )

  return (
    <div className="qr-layout has-text-centered pl-15 pr-15 connect-to-pvs">
      <span className="is-uppercase has-text-weight-bold">
        {t('LOOK_FOR_QR')}
      </span>
      {connectionState.connecting ? (
        <Loader />
      ) : (
        <div className="qr-icon mb-20">
          <i className="sp-qr has-text-white" />
        </div>
      )}

      <div className="mt-10 mb-10 pr-5 pl-5">
        <span className="is-size-6 has-text-centered">
          {connectionState.connecting ? t('CONNECTING_PVS') : t('QRCODE_HINT')}
        </span>
        <div className="mt-20">
          <button
            disabled={connectionState.connecting || started}
            className="button is-primary is-fullwidth"
            onClick={getBarcode}
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
            className="button button-transparent is-outlined is-fullwidth has-text-primary mt-20"
            onClick={() => showManualEntry(true)}
          >
            {t('MANUAL_ENTRY')}
          </button>
          <button
            disabled={connectionState.connecting}
            className="button button-transparent is-outlined is-fullwidth has-text-primary mt-20"
            onClick={goToNearbyDevices}
          >
            {t('NEARBY_DEVICES')}
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

      <SwipeableBottomSheet
        shadowTip={false}
        open={enableBle}
        onChange={() => showEnableBle(!enableBle)}
      >
        {btPermContent}
      </SwipeableBottomSheet>
    </div>
  )
}

export default ConnectToPVS
