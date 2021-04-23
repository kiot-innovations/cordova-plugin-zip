import React, { useEffect, useState } from 'react'
import {
  compose,
  includes,
  isEmpty,
  length,
  map,
  path,
  pathOr,
  pick,
  pluck,
  prop,
  propOr,
  uniqBy,
  flip,
  reject
} from 'ramda'
import { useDispatch, useSelector } from 'react-redux'
import clsx from 'clsx'
import SwipeableSheet from 'hocs/SwipeableSheet'
import { useHistory } from 'react-router-dom'
import moment from 'moment'
import paths from 'routes/paths'
import { useI18n } from 'shared/i18n'
import { either, generatePassword, generateSSID, isIos } from 'shared/utils'
import { decodeQRData, scanBarcodes } from 'shared/scanning'
import { rmaModes } from 'state/reducers/rma'
import {
  RMA_SELECT_PVS,
  SET_RMA_MODE,
  FETCH_DEVICE_TREE
} from 'state/actions/rma'
import { RESET_SYSTEM_CONFIGURATION } from 'state/actions/systemConfiguration'
import {
  BLE_GET_DEVICES,
  CHECK_BLUETOOTH_STATUS_INIT,
  CONNECT_PVS_VIA_BLE,
  OPEN_SETTINGS,
  RESET_PVS_CONNECTION,
  SET_AP_PWD,
  SET_SSID,
  STOP_NETWORK_POLLING,
  PVS_CONNECTION_INIT,
  ENABLE_BLUETOOTH_INIT,
  ENABLE_ACCESS_POINT
} from 'state/actions/network'
import {
  CONNECT_PVS_CAMERA,
  CONNECT_PVS_MANUALLY
} from 'state/actions/analytics'
import { SAVE_PVS_SN } from 'state/actions/pvs'
import { BLESTATUS } from 'state/reducers/network'
import { Loader } from 'components/Loader'
import './PVSelection.scss'

const getPvsSerialNumbers = compose(
  map(pick(['deviceSerialNumber', 'assignmentEffectiveTimestamp'])),
  uniqBy(prop('deviceSerialNumber')),
  pathOr([], ['site', 'sitePVS'])
)

const onScanSuccess = (generatePassword, dispatch, t) => data => {
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
}

const onScanFail = err => {
  alert(err)
}

function PvsSelection() {
  const PVS = useSelector(getPvsSerialNumbers)
  const siteSNs = pluck('deviceSerialNumber', PVS)
  const { rmaMode, cloudDeviceTree } = useSelector(state => state.rma)
  const { bluetoothEnabled, bluetoothStatus, err } = useSelector(
    pathOr({}, ['network'])
  )
  const [fetchDevicesStatus, showFetchDevicesStatus] = useState(false)
  const history = useHistory()
  const dispatch = useDispatch()
  const t = useI18n()
  const { nearbyDevices, connected, bleSearching } = useSelector(
    state => state.network
  )
  const [connecting, setConnecting] = useState(false)
  const [btPermissions, showBtPermissions] = useState(false)
  const [manualEntry, showManualEntry] = useState(false)
  const [serialNumber, setSerialNumber] = useState('')
  const [confirmConnectionModal, showConfirmConnectionModal] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState()

  const getBarcode = () => {
    scanBarcodes(onScanSuccess(generatePassword, dispatch, t), onScanFail)
  }

  const connectToPVS = device => {
    dismissConfirmConnection()
    setConnecting(true)
    const ssid = generateSSID(device.name)
    const password = generatePassword(device.name)
    dispatch(SET_SSID(ssid))
    dispatch(SET_AP_PWD(password))
    dispatch(CONNECT_PVS_VIA_BLE(device))
  }

  const dismissModal = () => setConnecting(false)

  const continueCommissioning = (rma = rmaModes.NONE) => {
    setConnecting(false)
    if (rma === rmaModes.EDIT_DEVICES) {
      history.push(paths.PROTECTED.RMA_DEVICES.path)
    } else {
      history.push(paths.PROTECTED.INVENTORY_COUNT.path)
    }
  }

  const resetErrors = () => {
    setConnecting(false)
    dispatch(RESET_PVS_CONNECTION())
    dispatch(CHECK_BLUETOOTH_STATUS_INIT())
  }

  const manualConnect = () => {
    showManualEntry(false)
    const ssid = generateSSID(serialNumber)
    const password = generatePassword(serialNumber)
    dispatch(SAVE_PVS_SN(serialNumber))
    dispatch(CONNECT_PVS_MANUALLY(serialNumber))
    dispatch(PVS_CONNECTION_INIT({ ssid, password }))
  }

  const enableBluetooth = () => {
    isIos() ? dispatch(OPEN_SETTINGS()) : dispatch(ENABLE_BLUETOOTH_INIT())
  }

  const connectingModalContent = (
    <div className="has-text-centered is-vertical tile">
      <p className="has-text-weight-bold has-text-white">{t('HOLD_ON')}</p>
      <p className="has-text-white mt-10 mb-10">{t('CONNECTING_TO_PVS')}</p>
      <Loader />
      <span className="has-text-weight-bold mt-10">
        {t('PLEASE_STAY_CLOSE')}
      </span>
    </div>
  )

  const connectedModalContent = (
    <div className="has-text-centered is-vertical tile">
      <p className="has-text-weight-bold has-text-white">
        {t('CONNECTION_SUCCESS')}
      </p>
      <div className="mt-10 mb-10">
        <span className="sp-check is-size-1 has-text-white" />
      </div>
      <p className="has-text-weight-bold mt-10 mb-10">
        {t('PLEASE_STAY_CLOSE_CONNECTED')}
      </p>
      <button
        className="button is-primary"
        onClick={() => continueCommissioning(rmaMode)}
      >
        {t('CONTINUE')}
      </button>
    </div>
  )

  const failureModalContent = (
    <div className="has-text-centered is-vertical tile">
      <p className="has-text-white has-text-weight-bold mb-10">
        {t('ERROR_WHILE_CONNECTING')}
      </p>
      <div className="mt-10 mb-10">
        <span className="sp-hey is-size-2 has-text-white" />
      </div>
      <p className="has-text-white mt-10 mb-10">{t('REBOOT_PVS_0')}</p>
      <p className="mb-15 has-text-weight-bold">{t('REBOOT_PVS_HUB')}</p>
      <ol className="pl-30 mb-10 has-text-left">
        <li>{t('REBOOT_PVS_1')}</li>
        <li>{t('REBOOT_PVS_2')}</li>
        <li>{t('REBOOT_PVS_3')}</li>
        <li>{t('REBOOT_PVS_4')}</li>
        <li>{t('REBOOT_PVS_5')}</li>
      </ol>
      <p className="mb-15 has-text-weight-bold">{t('REBOOT_PVS')}</p>
      <p className="mb-10">{t('REBOOT_PVS_6')}</p>
      <button className="button is-primary is-fullwidth" onClick={resetErrors}>
        {t('CLOSE')}
      </button>
    </div>
  )

  const confirmConnection = device => {
    setSelectedDevice({ device, sn: device.name })
    showConfirmConnectionModal(true)
  }

  const dismissConfirmConnection = () => {
    setSelectedDevice({})
    showConfirmConnectionModal(false)
  }

  const confirmModalContent = (
    <div className="has-text-centered is-vertical tile">
      <div className="mt-10 mb-10">
        <span className="sp-pvs is-size-1 has-text-white" />
      </div>
      <p className="has-text-white mt-10 mb-10">
        {t('CONFIRM_CONNECTION', propOr('', 'sn', selectedDevice))}
      </p>
      <div className="inline-buttons mt-10">
        <button
          className="button is-primary is-outlined"
          onClick={dismissConfirmConnection}
        >
          {t('CANCEL')}
        </button>
        <button
          className="button is-primary"
          onClick={() =>
            connectToPVS(
              propOr('', 'device', selectedDevice),
              propOr('', 'sn', selectedDevice)
            )
          }
        >
          {t('CONNECT')}
        </button>
      </div>
    </div>
  )

  const failureModalContent_noBLE = (
    <div className="has-text-centered">
      <p className="mb-10 has-text-white has-text-weight-bold mt-10 ">
        {t('COULD_NOT_CONNECT')}
      </p>
      <div className="mt-10 mb-10">
        <span className="sp-hey is-size-1 has-text-white" />
      </div>
      <p className="has-text-white mt-10 mb-10">
        {t('COULD_NOT_CONNECT_HINT')}
      </p>
      <div className="inline-buttons">
        <button
          className="button is-primary is-outlined"
          onClick={enableBluetooth}
        >
          {t(isIos() ? 'PERM_SETTINGS' : 'ENABLE_BLE')}
        </button>
        <button className="button is-primary" onClick={resetErrors}>
          {t('CLOSE')}
        </button>
      </div>
    </div>
  )

  const renderDevice = device => (
    <div
      className="ble-device mb-10"
      onClick={() => confirmConnection(device)}
      key={device.name}
    >
      <span className="mr-10 is-size-2 sp-pvs" />
      <div>
        <p className="has-text-white has-text-weight-bold">{device.name}</p>
        <p className="has-text-white">{t('FOUND_NEARBY')}</p>
      </div>
    </div>
  )

  const btPermContent = (
    <div className="has-text-centered">
      <div className="mb-10">
        <span className="sp-bth is-size-1 has-text-white" />
      </div>
      <p className="has-text-white mt-10 mb-10">{t('BLUETOOTH_PERM_HINT')}</p>
      <div className="has-text-centered">
        <button className="button is-primary" onClick={enableBluetooth}>
          {t(isIos() ? 'PERM_SETTINGS' : 'ENABLE_BLE')}
        </button>
      </div>
    </div>
  )

  useEffect(() => {
    if (connected || err) {
      setConnecting(false)
    }
  }, [connected, err])

  useEffect(() => {
    dispatch(STOP_NETWORK_POLLING())
    dispatch(RESET_PVS_CONNECTION())
    dispatch(CHECK_BLUETOOTH_STATUS_INIT())
    dispatch(RESET_SYSTEM_CONFIGURATION())
  }, [dispatch])

  useEffect(() => {
    if (bluetoothEnabled) {
      showBtPermissions(false)
      dispatch(BLE_GET_DEVICES())
    }
  }, [bluetoothEnabled, dispatch])

  useEffect(() => {
    if (rmaMode === rmaModes.REPLACE_PVS && !isEmpty(cloudDeviceTree.devices)) {
      history.push(paths.PROTECTED.RMA_EXISTING_DEVICES.path)
    }
  }, [cloudDeviceTree.devices, history, rmaMode])

  const PVSSelected = useSelector(path(['rma', 'pvs']))

  const editDevices = () => {
    dispatch(SET_RMA_MODE(rmaModes.EDIT_DEVICES))
    const ssid = generateSSID(PVSSelected)
    const password = generatePassword(PVSSelected)

    dispatch(SET_SSID(ssid))
    dispatch(SET_AP_PWD(password))

    dispatch(
      bluetoothEnabled
        ? ENABLE_ACCESS_POINT(PVSSelected)
        : PVS_CONNECTION_INIT({ ssid, password })
    )
    setConnecting(true)
  }

  const replacePVS = () => {
    showFetchDevicesStatus(true)
    dispatch(SET_RMA_MODE(rmaModes.REPLACE_PVS))
    dispatch(FETCH_DEVICE_TREE())
  }

  const sitePVSList = PVS.map(elem => {
    const { deviceSerialNumber, assignmentEffectiveTimestamp } = elem
    return (
      <div
        key={deviceSerialNumber}
        onClick={() => dispatch(RMA_SELECT_PVS(deviceSerialNumber))}
        className={clsx(
          { 'label-selected': deviceSerialNumber === PVSSelected },
          'mb-10 label'
        )}
      >
        <span className="has-text-weight-bold">{deviceSerialNumber}</span>
        <p>
          {t(
            'FIRST_CONNECTION',
            moment(assignmentEffectiveTimestamp).format('MM/DD/YYYY')
          )}
        </p>
      </div>
    )
  })

  return (
    <main className="full-height pl-10 pr-10 pvs-selection-screen">
      <section className="select-pvs-section">
        <span className="is-uppercase has-text-weight-bold mb-20 select-pvs-title">
          {t('SELECT_PVS')}
        </span>
        {either(
          !isEmpty(PVS),
          <div className="list-separator">
            <span className="list-separator_text">{t('PVS_DEVICES')}</span>
          </div>
        )}
        {either(
          isEmpty(PVS),
          <div className="has-text-centered is-flex tile is-vertical mb-20">
            <span className="has-text-weight-bold">
              {t('NO_ASSOCIATED_DEVICES')}
            </span>
            <span>{t('NO_ASSOCIATED_DEVICES_HINT')}</span>
          </div>,
          sitePVSList
        )}
        {either(
          !isEmpty(PVS),
          <div className="list-separator">
            <span className="list-separator_text">
              Add a new PVS to this site
            </span>
          </div>
        )}
        <div className="ble-device mb-10" onClick={getBarcode}>
          <span className="mr-10 is-size-3 has-text-weight-bold sp-qr" />
          <span>{t('ADD_VIA_QR')}</span>
        </div>
        <div className="ble-device mb-10" onClick={() => showManualEntry(true)}>
          <span className="mr-10 is-size-3 has-text-weight-bold sp-plus" />
          <span>{t('ADD_VIA_SN')}</span>
        </div>
        {either(
          !bluetoothEnabled,
          <div
            className="ble-device mb-10"
            onClick={() => showBtPermissions(true)}
          >
            <span className="mr-10 is-size-3 has-text-weight-bold sp-bth" />
            <span>{t('ENABLE_BT_PERMISSIONS')}</span>
          </div>
        )}
        {either(
          bleSearching && isEmpty(nearbyDevices),
          <section className="has-text-centered">
            <p>{t('BLE_SEARCHING')}</p>
            <Loader className="is-size-5" />
          </section>,

          either(
            bluetoothStatus === BLESTATUS.DISCOVERY_FAILURE,
            <>
              <p>{t('NO_PVS_NEARBY')}</p>
              <div
                className="ble-device mb-10 mt-10"
                onClick={() => dispatch(BLE_GET_DEVICES())}
              >
                <span className="mr-10 is-size-3 has-text-weight-bold sp-bth" />
                <span>{t('SEARCH_AGAIN')}</span>
              </div>
            </>,
            compose(
              map(renderDevice),
              reject(compose(flip(includes)(siteSNs), prop('name')))
            )(nearbyDevices)
          )
        )}
      </section>

      <section className="pvs-buttons inline-buttons mb-10">
        <button
          disabled={!PVSSelected}
          className={clsx(
            { hidden: !PVSSelected },
            'button is-uppercase is-secondary'
          )}
          onClick={replacePVS}
        >
          {t('REPLACE_PVS')}
        </button>
        <button
          disabled={!PVSSelected}
          className={clsx(
            { hidden: !PVSSelected },
            'button is-uppercase is-secondary'
          )}
          onClick={editDevices}
        >
          {t('CONNECT_TO_PVS')}
        </button>
      </section>

      <SwipeableSheet
        open={fetchDevicesStatus}
        onChange={() => showFetchDevicesStatus(!fetchDevicesStatus)}
      >
        <div className="fetch-devices-status is-flex">
          <span className="has-text-weight-bold has-text-white mb-40">
            {either(
              cloudDeviceTree.error,
              t('FETCH_DEVICETREE_ERROR'),
              t('FETCH_DEVICETREE_WAIT')
            )}
          </span>
          {either(
            cloudDeviceTree.fetching,
            <Loader />,
            <div>
              <button className="button is-primary mb-20" onClick={replacePVS}>
                {t('TRY_AGAIN')}
              </button>
            </div>
          )}
        </div>
      </SwipeableSheet>

      <SwipeableSheet
        onChange={dismissModal}
        open={Boolean(err) || connecting || connected}
      >
        <div className="tile is-vertical">
          {either(connecting, connectingModalContent)}
          {either(connected, connectedModalContent)}
          {either(
            err,
            bluetoothEnabled ? failureModalContent : failureModalContent_noBLE
          )}
        </div>
      </SwipeableSheet>

      <SwipeableSheet
        onChange={() => showBtPermissions(!btPermissions)}
        open={btPermissions}
      >
        {btPermContent}
      </SwipeableSheet>

      <SwipeableSheet
        open={manualEntry}
        onChange={() => showManualEntry(!manualEntry)}
      >
        <div className="manual-entry has-text-centered">
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
      </SwipeableSheet>

      <SwipeableSheet
        onChange={dismissConfirmConnection}
        open={confirmConnectionModal}
      >
        <div className="has-text-centered">{confirmModalContent}</div>
      </SwipeableSheet>
    </main>
  )
}

export default PvsSelection
