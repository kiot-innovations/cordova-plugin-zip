import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import {
  concat,
  difference,
  groupBy,
  isEmpty,
  keys,
  length,
  props,
  pluck,
  propOr,
  values
} from 'ramda'
import { useI18n } from 'shared/i18n'
import { either, removeUndefined } from 'shared/utils'
import { CLEAR_RMA, SET_NEW_EQUIPMENT } from 'state/actions/rma'
import { UPDATE_SN } from 'state/actions/pvs'
import {
  UPDATE_MI_COUNT,
  UPDATE_OTHER_INVENTORY,
  UPDATE_STORAGE_INVENTORY
} from 'state/actions/inventory'
import MicroinvertersGroup from './MicroinvertersGroup'
import MetersGroup from './MetersGroup'
import StorageGroup from './StorageGroup'
import './ExistingDevices.scss'
import OtherGroup from './OtherGroup'
import paths from 'routes/paths'

const ExistingDevices = () => {
  const t = useI18n()
  const dispatch = useDispatch()
  const history = useHistory()
  const { cloudDeviceTree } = useSelector(state => state.rma)

  const backToPvsSelection = () => {
    dispatch(CLEAR_RMA())
    history.push(paths.PROTECTED.PVS_SELECTION_SCREEN.path)
  }

  /*---------
  ESMM, Logger & DCM Controllers are devices that should not be shown to the user.
  We place them in the following object so they don't appear under Other Devices.
  -----------*/
  const dvcTypes = {
    microinverter: 'inverter',
    meter: 'power meter',
    battery: 'battery',
    ess: 'ess',
    midc: 'transfer switch',
    storageInverter: 'storage inverter',
    storageGateway: 'storage gateway',
    esmm: 'esmm',
    logger: 'logger',
    dcmController: 'dcm controller',
    unknown: 'unknown'
  }

  const groupedDevices = groupBy(
    propOr('unknown', 'DvcTy'),
    cloudDeviceTree.devices
  )

  const expectedTypes = values(dvcTypes)
  const foundTypes = keys(groupedDevices)
  const otherTypes = difference(foundTypes, expectedTypes)

  const otherDevices = removeUndefined(
    props([...otherTypes, 'unknown'], groupedDevices)
  )

  const storageDevices = concat(
    propOr([], dvcTypes.ess, groupedDevices),
    propOr([], dvcTypes.battery, groupedDevices),
    propOr([], dvcTypes.midc, groupedDevices),
    propOr([], dvcTypes.storageInverter, groupedDevices),
    propOr([], dvcTypes.gateway, groupedDevices)
  )

  const microinverters = propOr([], dvcTypes.microinverter, groupedDevices)

  const meters = propOr([], dvcTypes.meter, groupedDevices)

  const updateMiList = () => {
    const serialNumbers = pluck('ConnDvcSn', microinverters)
    if (!isEmpty(serialNumbers)) {
      const snList = serialNumbers.map(sn => {
        return { serial_number: sn, type: 'SOLARBRIDGE' }
      })
      dispatch(UPDATE_SN(snList))
      dispatch(UPDATE_MI_COUNT(snList.length))
    }
  }

  const updateStorageInventory = () => {
    if (!isEmpty(storageDevices)) {
      dispatch(UPDATE_STORAGE_INVENTORY('16kWh'))
    }
  }

  const updateOtherInventory = () => {
    if (!isEmpty(otherDevices)) {
      dispatch(UPDATE_OTHER_INVENTORY(true))
    }
  }

  const updateInventory = newEquipment => {
    updateMiList()
    updateStorageInventory()
    updateOtherInventory()
    dispatch(SET_NEW_EQUIPMENT(newEquipment))
    history.push(paths.PROTECTED.CONNECT_TO_PVS.path)
  }

  return (
    <div className="existing-devices pl-10 pr-10">
      <div className="existing-devices-header has-text-centered">
        <span
          className="has-text-primary sp-chevron-left is-size-4"
          onClick={backToPvsSelection}
        />
        <span className="has-text-weight-bold">{t('EXISTING_DEVICES')}</span>
        <span />
      </div>

      <div className="existing-devices-content">
        <MicroinvertersGroup
          data={microinverters}
          allDevices={cloudDeviceTree.devices}
        />
        <MetersGroup data={meters} />
        <StorageGroup data={storageDevices} />
        {either(length(otherDevices) > 0, <OtherGroup data={otherDevices} />)}
      </div>

      <div className="existing-devices-footer has-text-centered">
        <div className="mb-10 has-text-weight-bold">
          <span> {t('CONTAINS_NEW_EQUIPMENT')} </span>
        </div>
        <div>
          <button
            className="button is-primary is-outlined mr-20"
            onClick={() => updateInventory(false)}
          >
            {t('NO')}
          </button>
          <button
            className="button is-primary ml-20"
            onClick={() => updateInventory(true)}
          >
            {t('YES')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ExistingDevices
