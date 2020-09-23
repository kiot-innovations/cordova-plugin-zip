import React, { useEffect, useState } from 'react'
import {
  assoc,
  compose,
  dissoc,
  filter,
  has,
  ifElse,
  map,
  pathOr,
  prop,
  propEq,
  propOr,
  reject
} from 'ramda'
import { useDispatch, useSelector } from 'react-redux'

import Collapsible from 'components/Collapsible'
import { FETCH_DEVICES_LIST } from 'state/actions/devices'
import { GET_ESS_STATUS_INIT, GET_PREDISCOVERY } from 'state/actions/storage'
import { useI18n } from 'shared/i18n'

import './RMADevices.scss'

const DrawStorage = ({ devices }) =>
  map(essDevice => {
    const type = prop('device_type', essDevice)
    const serialNumber = prop('serial_number', essDevice)
    return (
      <div key={serialNumber}>
        <span className="has-text-weight-bold has-text-white">{type}</span>
        <span className="ml-10">{serialNumber}</span>
      </div>
    )
  }, devices)

const DrawOtherDevices = ({ devices }) =>
  map(OtherDevice => {
    const model = prop('MODEL', OtherDevice)
    const serial = prop('SERIAL', OtherDevice)
    return (
      <div key={serial}>
        <span className="has-text-weight-bold has-text-white">{model}</span>
        <span className="ml-10">{serial}</span>
      </div>
    )
  }, devices)

function RMADevices() {
  const dispatch = useDispatch()
  const t = useI18n()
  const [MiSelected, setSelectedMi] = useState({})
  const devicesData = useSelector(pathOr([], ['devices', 'found']))
  const essDevices = useSelector(
    pathOr([], ['storage', 'prediscovery', 'pre_discovery_report', 'devices'])
  )
  const microInverters = filter(propEq('Inverter', 'DEVICE_TYPE'), devicesData)
  const otherDevices = reject(propEq('Inverter', 'DEVICE_TYPE'), devicesData)

  const toggleCheckbox = id =>
    compose(setSelectedMi, ifElse(has(id), dissoc(id), assoc(id)))(MiSelected)

  const selectAllMi = () => {
    let newMiSelected = {}

    microInverters.forEach(inverter => {
      const serial = prop('SERIAL', inverter)
      newMiSelected = assoc(serial, serial, newMiSelected)
    })
    setSelectedMi(newMiSelected)
  }

  useEffect(() => {
    dispatch(FETCH_DEVICES_LIST())
    dispatch(GET_PREDISCOVERY())
    dispatch(GET_ESS_STATUS_INIT())
  }, [dispatch])

  const renderMicroinverter = inverter => {
    const serial = propOr('', 'SERIAL', inverter)
    const isChecked = has(serial, MiSelected)
    return (
      <label
        className="has-text-weight-bold has-text-white pb-10 pt-10 "
        key={serial}
      >
        <input
          type="checkbox"
          value={serial}
          checked={isChecked}
          onChange={() => toggleCheckbox(serial)}
          className="mr-10"
        />
        {serial}
      </label>
    )
  }

  return (
    <main className="full-height pl-10 pr-10 rma-devices-screen">
      <div className="header mb-20">
        <span className="sp-chevron-left has-text-primary is-size-4 go-back" />
        <span className="is-uppercase has-text-weight-bold  page-title">
          {t('RMA_DEVICES')}
        </span>
      </div>
      <Collapsible title={t('MICROINVERTERS')} expanded>
        {map(renderMicroinverter, microInverters)}
        <div className="buttons-container">
          <button
            onClick={selectAllMi}
            className="button is-paddingless has-text-primary button-transparent"
          >
            {t('SELECT_ALL')}
          </button>
          <button
            disabled={Object.values(MiSelected).length === 0}
            className="button is-paddingless has-text-primary button-transparent"
          >
            {t('REMOVE')}
          </button>
        </div>
      </Collapsible>
      <div className="mt-10" />
      <Collapsible title="Storage Equipment" expanded>
        <DrawStorage devices={essDevices} />
        <button className="button is-paddingless has-text-primary button-transparent">
          {t('ADD_REPLACE_EQUIPMENT')}
        </button>
      </Collapsible>
      <div className="mt-10" />
      <Collapsible title={t('OTHER_DEVICES')} expanded>
        <div className="other-components">
          <DrawOtherDevices devices={otherDevices} />
        </div>
      </Collapsible>
    </main>
  )
}

export default RMADevices
