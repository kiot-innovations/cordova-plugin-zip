import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import {
  assoc,
  compose,
  dissoc,
  filter,
  has,
  ifElse,
  keys,
  length,
  map,
  pathOr,
  prop,
  propEq,
  propOr
} from 'ramda'
import { useDispatch, useSelector } from 'react-redux'
import paths from 'routes/paths'
import Collapsible from 'components/Collapsible'
import { FETCH_DEVICES_LIST } from 'state/actions/devices'
import { GET_PREDISCOVERY } from 'state/actions/storage'
import { RMA_REMOVE_DEVICES, CLEAR_RMA } from 'state/actions/rma'
import { SHOW_MODAL } from 'state/actions/modal'
import { either } from 'shared/utils'
import { useI18n } from 'shared/i18n'

import './RMADevices.scss'

const renderMicroinverter = (toggleCheckbox, selectedMIs) => inverter => {
  const serial = propOr('', 'SERIAL', inverter)
  const isChecked = has(serial, selectedMIs)
  return (
    <label
      className="has-text-weight-bold has-text-white pb-10 pt-10 is-flex"
      key={serial}
    >
      <input
        type="checkbox"
        value={serial}
        checked={isChecked}
        onChange={() => toggleCheckbox(serial)}
        className="mr-10 checkbox-dark"
      />
      {serial}
    </label>
  )
}

const renderStorage = storageDevice => {
  const type = prop('device_type', storageDevice)
  const serialNumber = prop('serial_number', storageDevice)
  return (
    <div key={serialNumber}>
      <span className="has-text-weight-bold has-text-white">{type}</span>
      <span className="ml-10">{serialNumber}</span>
    </div>
  )
}

function RMADevices() {
  const t = useI18n()
  const dispatch = useDispatch()
  const history = useHistory()

  const [selectedMIs, setSelectedMIs] = useState({})
  const devicesData = useSelector(pathOr([], ['devices', 'found']))
  const storageDevices = useSelector(
    pathOr([], ['storage', 'prediscovery', 'pre_discovery_report', 'devices'])
  )

  const microInverters = filter(propEq('DEVICE_TYPE', 'Inverter'), devicesData)

  const toggleCheckbox = id =>
    compose(setSelectedMIs, ifElse(has(id), dissoc(id), assoc(id)))(selectedMIs)

  const selectAllMi = () => {
    let newMiSelected = {}

    microInverters.forEach(inverter => {
      const serial = prop('SERIAL', inverter)
      newMiSelected = assoc(serial, serial, newMiSelected)
    })
    setSelectedMIs(newMiSelected)
  }

  const removeSelectedMIs = () => {
    dispatch(RMA_REMOVE_DEVICES(keys(selectedMIs)))
    dispatch(
      SHOW_MODAL({
        componentPath: './DeleteDevicesModal.jsx'
      })
    )
    setSelectedMIs({})
  }

  const backToPvsSelection = () => {
    dispatch(CLEAR_RMA())
    history.push(paths.PROTECTED.PVS_SELECTION_SCREEN.path)
  }

  const fetchDevices = () => {
    dispatch(FETCH_DEVICES_LIST())
    dispatch(GET_PREDISCOVERY())
  }

  useEffect(() => {
    dispatch(FETCH_DEVICES_LIST())
    dispatch(GET_PREDISCOVERY())
  }, [dispatch])

  const addMI = (
    <span
      onClick={() => history.push(paths.PROTECTED.SCAN_LABELS.path)}
      className="is-paddingless has-text-primary has-text-weight-bold is-size-7 button-transparent"
    >
      {t('ADD')}
    </span>
  )

  return (
    <main className="full-height pl-10 pr-10 rma-devices">
      <div className="header mb-20">
        <span
          className="sp-chevron-left has-text-primary is-size-4 go-back"
          onClick={backToPvsSelection}
        />
        <span className="is-uppercase has-text-weight-bold  page-title">
          {t('RMA_DEVICES')}
        </span>
      </div>
      <Collapsible title={t('MICROINVERTERS')} actions={addMI} expanded>
        {either(
          length(microInverters) > 0,
          map(renderMicroinverter(toggleCheckbox, selectedMIs), microInverters),
          t('NO_MICROINVERTERS_RMA')
        )}
        <div className="buttons-container">
          <button
            onClick={selectAllMi}
            className="button is-paddingless has-text-primary has-text-weight-bold is-size-7 button-transparent"
          >
            {t('SELECT_ALL')}
          </button>
          <button
            onClick={removeSelectedMIs}
            disabled={Object.values(selectedMIs).length === 0}
            className="button is-paddingless has-text-primary has-text-weight-bold is-size-7 button-transparent"
          >
            {t('REMOVE')}
          </button>
        </div>
      </Collapsible>
      <div className="mt-10" />
      <Collapsible title="Storage Equipment" expanded>
        {either(
          length(storageDevices) > 0,
          map(renderStorage, storageDevices),
          t('NO_STORAGE_RMA')
        )}
        <div className="buttons-container">
          <button
            onClick={() =>
              history.push(paths.PROTECTED.STORAGE_PREDISCOVERY.path)
            }
            className="button is-paddingless has-text-primary has-text-weight-bold is-size-7 button-transparent"
          >
            {t('ADD_REPLACE_EQUIPMENT')}
          </button>
        </div>
      </Collapsible>
      <div className="mt-10 has-text-centered button-container">
        <button
          onClick={fetchDevices}
          className="button is-paddingless has-text-primary has-text-weight-bold is-size-7 button-transparent"
        >
          {t('REFRESH_DEVICE_LIST')}
        </button>
      </div>
    </main>
  )
}

export default RMADevices
