import { length, map, propOr, reject } from 'ramda'
import React from 'react'
import { useDispatch } from 'react-redux'

import Collapsible from 'components/Collapsible'
import { useI18n } from 'shared/i18n'
import { UPDATE_DEVICE_TREE } from 'state/actions/rma'
import './ExistingDevices.scss'

const deviceRow = removeInverter => deviceItem => {
  const sn = propOr('', 'ConnDvcSn', deviceItem)
  return (
    <div className="pt-5 pb-5 device-item-deletable" key={sn}>
      <span className="mt-5 mb-5 has-text-white">{sn}</span>
      <button
        onClick={() => removeInverter(sn)}
        className="has-text-white is-size-6"
      >
        <i className="sp-close" />
      </button>
    </div>
  )
}

const MicroinvertersGroup = ({ data, allDevices }) => {
  const t = useI18n()
  const dispatch = useDispatch()

  const removeInverter = serial => {
    const filterMi = mi => propOr('', 'ConnDvcSn', mi) === serial
    const filteredList = reject(filterMi, allDevices)
    dispatch(UPDATE_DEVICE_TREE(filteredList))
  }

  const deviceList = map(deviceRow(removeInverter), data)

  return (
    <div className="mt-10 mb-10">
      <Collapsible
        className="is-flex flex-column"
        title={t('MICROINVERTERS')}
        actions={length(data)}
      >
        {length(data) > 0 ? (
          deviceList
        ) : (
          <span className="has-text-weight-bold">
            {t('NO_MICROINVERTERS_RMA')}
          </span>
        )}
      </Collapsible>
    </div>
  )
}

export default MicroinvertersGroup
