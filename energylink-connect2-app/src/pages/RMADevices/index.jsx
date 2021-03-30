/* eslint-disable */

import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import {
  assoc,
  compose,
  dissoc,
  filter,
  has,
  ifElse,
  isEmpty,
  keys,
  length,
  map,
  pathOr,
  prop,
  propEq,
  propOr
} from 'ramda'
import { useDispatch, useSelector } from 'react-redux'
import {
  Menu,
  MenuItem,
  MenuDivider
} from '@szhsin/react-menu'
import '@szhsin/react-menu/dist/index.css'
import paths from 'routes/paths'
import Collapsible from 'components/Collapsible'
import { FETCH_DEVICES_LIST } from 'state/actions/devices'
import { RMA_REMOVE_DEVICES, CLEAR_RMA } from 'state/actions/rma'
import { SHOW_MODAL } from 'state/actions/modal'
import { ALLOW_COMMISSIONING } from 'state/actions/systemConfiguration'
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

function RMADevices() {
  const t = useI18n()
  const dispatch = useDispatch()
  const history = useHistory()

  useEffect(() => {
    dispatch(ALLOW_COMMISSIONING())
    dispatch(FETCH_DEVICES_LIST())
  }, [dispatch])

  const [selectedMIs, setSelectedMIs] = useState({})
  const devicesData = useSelector(pathOr([], ['devices', 'found']))
  const storageDevices = filter(propEq('TYPE', 'EQUINOX-ESS'), devicesData)
  const hasStorage = !isEmpty(storageDevices)

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
  }

  const addMI = (
    <span
      onClick={() => history.push(paths.PROTECTED.SCAN_LABELS.path)}
      className="is-paddingless has-text-primary has-text-weight-bold is-size-7 button-transparent"
    >
      {t('ADD')}
    </span>
  )

  const miDropdown = (
    <Menu className="dark-menu" menuButton={<span className="has-text-primary is-size-5 sp-contextmenu" />}>
      <MenuItem className="dark-menu-item has-text-primary has-text-left has-text-weight-bold" onClick={() => history.push(paths.PROTECTED.SCAN_LABELS.path)}>{t('ADD_MIS')}</MenuItem>
      <MenuDivider />
      <MenuItem className="dark-menu-item has-text-primary has-text-left has-text-weight-bold" onClick={() => history.push(paths.PROTECTED.MODEL_EDIT.path)}>{t('EDIT_PANELS')}</MenuItem>
    </Menu>
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
      <Collapsible title={t('MICROINVERTERS')} actions={miDropdown} expanded>
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
        <span className="has-text-white has-text-weight-bold">
          {either(hasStorage, t('HAS_STORAGE_RMA'), t('NO_STORAGE_RMA'))}
        </span>
        <span className="mt-5">
          {either(
            hasStorage,
            t('HAS_STORAGE_RMA_HINT'),
            t('NO_STORAGE_RMA_HINT')
          )}
        </span>
        <div className="buttons-container">
          <button
            onClick={() =>
              history.push(paths.PROTECTED.STORAGE_PREDISCOVERY.path)
            }
            className="button is-paddingless has-text-primary has-text-weight-bold is-size-7 button-transparent"
          >
            {hasStorage ? t('RECOMM_STORAGE') : t('COMM_STORAGE')}
          </button>
        </div>
      </Collapsible>
      <div className="mt-10 has-text-centered button-container">
        <button
          onClick={fetchDevices}
          className="button mb-30 is-paddingless has-text-primary has-text-weight-bold is-size-7 button-transparent"
        >
          {t('REFRESH_DEVICE_LIST')}
        </button>
      </div>
    </main>
  )
}

export default RMADevices
