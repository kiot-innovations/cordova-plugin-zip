import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { compose, equals, isEmpty, isNil, length, path, pathOr } from 'ramda'
import SwipeableBottomSheet from 'react-swipeable-bottom-sheet'
import { useI18n } from 'shared/i18n'
import { decodeQRData, scanBarcodes } from 'shared/scanning'
import { generatePassword, generateSSID, isIos, either } from 'shared/utils'
import { rmaModes } from 'state/reducers/rma'
import {
  HIDE_ENABLING_ACCESS_POINT,
  PVS_CONNECTION_INIT,
  PVS_TIMEOUT_FOR_CONNECTION,
  CHECK_BLUETOOTH_STATUS_INIT
} from 'state/actions/network'
import { SAVE_PVS_SN } from 'state/actions/pvs'
import { Loader } from 'components/Loader'
import paths from 'routes/paths'
import './ConnectToPVS.scss'
import {
  CONNECT_PVS_CAMERA,
  CONNECT_PVS_MANUALLY,
  START_SCANNING
} from 'state/actions/analytics'
import { BLESTATUS } from 'state/reducers/network'

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
  const { serialNumber: pvsSN } = useSelector(state => state.pvs)
  const rmaPVSSelectedSN = useSelector(path(['rma', 'pvs']))
  const rmaMode = useSelector(path(['rma', 'rmaMode']))
  const { bluetoothAuthorized } = useSelector(pathOr({}, ['network']))
  const [manualEntry, showManualEntry] = useState(false)
  const [serialNumber, setSerialNumber] = useState('')
  const [started, setStarted] = useState(false)

  const onFail = err => {
    alert(err)
    setStarted(false)
  }

  useEffect(() => {
    if (!bluetoothAuthorized) history.push(paths.PROTECTED.PERMISSIONS.path)
  }, [bluetoothAuthorized, history])

  useEffect(() => {
    if (
      !connectionState.bluetoothEnabled &&
      !connectionState.bluetoothEnabledStarted
    )
      dispatch(CHECK_BLUETOOTH_STATUS_INIT())
  }, [
    connectionState.bluetoothEnabled,
    connectionState.bluetoothEnabledStarted,
    dispatch
  ])

  useEffect(() => {
    if (
      connectionState.connecting &&
      !connectionState.showEnablingAccessPoint &&
      !connectionState.bluetoothStatus !== BLESTATUS.FAILED_ACCESS_POINT_ON_PVS
    )
      dispatch(PVS_TIMEOUT_FOR_CONNECTION())
  }, [
    connectionState.bluetoothStatus,
    connectionState.connecting,
    connectionState.showEnablingAccessPoint,
    dispatch
  ])

  useEffect(() => {
    if (
      !isEmpty(rmaPVSSelectedSN) &&
      !isNil(rmaPVSSelectedSN) &&
      equals(rmaMode, rmaModes.EDIT_DEVICES)
    ) {
      const ssid = generateSSID(rmaPVSSelectedSN)
      const password = generatePassword(rmaPVSSelectedSN)
      dispatch(SAVE_PVS_SN(rmaPVSSelectedSN))
      dispatch(PVS_CONNECTION_INIT({ ssid, password }))
    }
  }, [dispatch, rmaMode, rmaPVSSelectedSN])

  useEffect(() => {
    if (connectionState.connected) {
      history.push(paths.PROTECTED.PVS_CONNECTION_SUCCESS.path)
    }
  }, [connectionState.connected, dispatch, history])

  const manualConnect = () => {
    showManualEntry(false)
    const ssid = generateSSID(serialNumber)
    const password = generatePassword(serialNumber)
    dispatch(SAVE_PVS_SN(serialNumber))
    dispatch(CONNECT_PVS_MANUALLY(serialNumber))
    dispatch(PVS_CONNECTION_INIT({ ssid, password }))
  }

  const retryConnect = () => {
    const ssid = connectionState.SSID
    const password = connectionState.password
    dispatch(PVS_CONNECTION_INIT({ ssid, password }))
  }

  const getBarcode = () => {
    setStarted(true)
    dispatch(START_SCANNING())
    scanBarcodes(onSuccess(generatePassword, dispatch, t, setStarted), onFail)
  }

  const disableScanBtn = !connectionState.bluetoothEnabled
  const bleClasses = {
    ENABLED_ACCESS_POINT_ON_PVS: 'has-text-success',
    FAILED_ACCESS_POINT_ON_PVS: 'has-text-danger'
  }

  return (
    <div className="qr-layout has-text-centered pl-15 pr-15">
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

      <div className="is-flex file is-centered tile is-vertical pr-5 pl-5 mb-20">
        {either(
          connectionState.bluetoothEnabled,
          <p className={bleClasses[connectionState.bluetoothStatus]}>
            {t(connectionState.bluetoothStatus)}
          </p>,
          either(
            isIos(),
            <p className="has-text-danger">{t('PHONE_BL_ON')}</p>,
            <p className="has-text-primary">{t('TURNING_PHONE_BL_ON')}</p>
          )
        )}
      </div>

      <div className="mt-10 mb-10 pr-5 pl-5">
        <span className="is-size-6 has-text-centered">
          {connectionState.connecting ? t('CONNECTING_PVS') : t('QRCODE_HINT')}
        </span>
        <div className="mt-20">
          {either(
            equals(
              connectionState.bluetoothStatus,
              BLESTATUS.FAILED_ACCESS_POINT_ON_PVS
            ),

            <button
              disabled={connectionState.connecting || disableScanBtn}
              className="button is-primary is-fullwidth"
              onClick={retryConnect}
            >
              {t('RETRY_CONNECT')}
            </button>,

            <button
              disabled={connectionState.connecting || started || disableScanBtn}
              className="button is-primary is-fullwidth"
              onClick={getBarcode}
            >
              {t('START_SCAN')}
            </button>
          )}
        </div>
      </div>

      <div className="mt-30">
        <span>{t('MANUAL_ENTRY_HINT')}</span>
        <div>
          <button
            disabled={connectionState.connecting || disableScanBtn}
            className="button button-transparent is-outlined is-fullwidth has-text-primary mt-20"
            onClick={() => showManualEntry(true)}
          >
            {t('MANUAL_ENTRY')}
          </button>
        </div>
      </div>

      <SwipeableBottomSheet
        shadowTip={false}
        open={connectionState.showEnablingAccessPoint && isIos()}
        onChange={compose(dispatch, HIDE_ENABLING_ACCESS_POINT)}
      >
        <div className="manual-instructions is-flex">
          <span className="has-text-white mb-10">
            {t('MANUAL_CONNECT_INSTRUCTIONS_1')}
          </span>
          <span className="mb-10">{t('MANUAL_CONNECT_INSTRUCTIONS_2')}</span>
          <div className="is-flex network-details">
            <p className="mb-0 has-text-white">{pvsSN}</p>
          </div>
          <div className="is-flex file is-centered tile is-vertical pr-5 pl-5 mb-20">
            {either(
              connectionState.bluetoothEnabled,
              <p className={bleClasses[connectionState.bluetoothStatus]}>
                {t(connectionState.bluetoothStatus)}
              </p>,
              <p className="has-text-danger">{t('PHONE_BL_ON')}</p>
            )}
          </div>
        </div>
      </SwipeableBottomSheet>

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
