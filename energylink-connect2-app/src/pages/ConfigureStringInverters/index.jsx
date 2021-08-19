import { clone, findIndex, map, propEq, propOr } from 'ramda'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import StringInverter from 'components/StringInverter'
import SwipeableSheet from 'hocs/SwipeableSheet'
import { useStringInverterSelector } from 'pages/StringInverters/OtherDevicesList'
import paths from 'routes/paths'
import { useI18n } from 'shared/i18n'
import { getStringInverters, isUnknownSerialNumber } from 'shared/utils'
import { FETCH_MODELS_INIT, UPDATE_DEVICES_LIST } from 'state/actions/devices'
import { SAVE_STRING_INVERTERS } from 'state/actions/stringInverters'

const WaitingClaimingDevices = () => {
  const { settingMetadata, setMetadataStatus } = useSelector(state => state.pvs)
  const t = useI18n()
  const history = useHistory()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (settingMetadata) setOpen(true)
  }, [history, settingMetadata])

  const clickHandler = () => {
    if (settingMetadata === false && setMetadataStatus === 'success')
      return history.push(paths.PROTECTED.RMA_DEVICES.path)
  }
  return (
    <SwipeableSheet open={open} onChange={clickHandler}>
      <h1 className="has-text-white is-size-4">{t('CLAIMING_DEVICES')}</h1>
      <button className="button primary is-primary" onClick={clickHandler}>
        {t('CONTINUE')}
      </button>
    </SwipeableSheet>
  )
}
const PendingDeviceConfiguration = ({ open, close }) => {
  const t = useI18n()
  return (
    <SwipeableSheet open={open} onChange={close}>
      <div className="tile is-flex flex-column">
        <span className="has-text-centered has-text-white mb-10 has-text-weight-bold">
          {t('ATTENTION')}
        </span>
        <span className="has-text-centered has-text-white mt-10 mb-20">
          {t('CONFIG_MISSING')}
        </span>
        <button className="button is-primary" onClick={close}>
          {t('CONTINUE')}
        </button>
      </div>
    </SwipeableSheet>
  )
}

const buildStringInverterObject = device => {
  return {
    moduleCount: device.COUNT,
    panelModel: device.panelModel,
    serialNumber: device.SERIAL,
    productModelName: device.MODEL,
    operation: 'BIND',
    type: 'INVERTER'
  }
}

const ConfigureStringInverters = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const t = useI18n()

  const { found } = useSelector(state => state.devices)
  const { groupedDevices } = useStringInverterSelector()
  const [pendingConfig, setOpenPendingConfig] = useState(false)

  const inverters = propOr([], 'Inverter', groupedDevices)
  const stringInverters = getStringInverters(inverters)
  const [devices, setDevices] = useState(stringInverters)

  const finished = !devices.find(
    ({ SERIAL = '', COUNT = 0, panelModel = '' }) =>
      isUnknownSerialNumber(SERIAL) || COUNT === 0 || panelModel === ''
  )

  useEffect(() => {
    dispatch(FETCH_MODELS_INIT())
  }, [dispatch])

  useEffect(() => {
    if (devices.length !== stringInverters.length) {
      setDevices(stringInverters)
    }
  }, [stringInverters, devices.length])

  const updateDevice = (index, device) => {
    const devicesCopy = clone(devices)
    devicesCopy[index] = device
    setDevices(devicesCopy)
  }

  const saveInverters = () => {
    if (finished) {
      const deviceListCopy = clone(found)
      devices.forEach(device => {
        const inverterToModifyIndex = findIndex(
          propEq('SERIAL', device.SERIAL)
        )(deviceListCopy)
        deviceListCopy[inverterToModifyIndex].COUNT = device.COUNT
        deviceListCopy[inverterToModifyIndex].SERIAL = device.SERIAL
        deviceListCopy[inverterToModifyIndex].panelModel = device.panelModel
      })
      dispatch(UPDATE_DEVICES_LIST(deviceListCopy))
      const refactoredStringInverters = map(buildStringInverterObject, devices)
      dispatch(SAVE_STRING_INVERTERS(refactoredStringInverters))
      history.push(paths.PROTECTED.RMA_DEVICES.path)
    }
    setOpenPendingConfig(true)
  }

  const goBack = () => {
    history.push(paths.PROTECTED.ADD_STRING_INVERTERS.path)
  }
  return (
    <div className="fill-parent is-flex tile is-vertical has-text-centered pl-10 pr-10 mb-40">
      <div className="header mb-20">
        <span
          className="sp-chevron-left has-text-primary is-size-4 go-back"
          onClick={goBack}
        />
        <span className="is-uppercase has-text-weight-bold  page-title">
          {t('STRING_INVERTERS')}
        </span>
      </div>
      <div>
        {devices.map((device, index) => (
          <StringInverter
            key={index}
            device={device}
            updateDevice={updateDevice}
            index={index}
          />
        ))}
      </div>
      <div className="is-flex">
        <button
          className="button is-primary is-outlined is-uppercase is-fullwidth mr-10"
          onClick={goBack}
        >
          {t('CANCEL')}
        </button>
        <button
          className="button is-primary is-fullwidth ml-10"
          onClick={saveInverters}
        >
          {t('SAVE')}
        </button>
      </div>
      <WaitingClaimingDevices />
      <PendingDeviceConfiguration
        open={pendingConfig}
        close={() => setOpenPendingConfig(false)}
      />
    </div>
  )
}

export default ConfigureStringInverters
