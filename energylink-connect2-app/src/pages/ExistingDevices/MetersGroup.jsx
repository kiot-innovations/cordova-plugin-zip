import React from 'react'
import { anyPass, length, map, endsWith, propOr } from 'ramda'
import { useI18n } from 'shared/i18n'
import { either, removeUndefined } from 'shared/utils'
import Collapsible from 'components/Collapsible'
import './ExistingDevices.scss'

// Add conditions here to omit devices from the results

const omitConditions = () => {
  const isVirtual = endsWith('-dcm-vm-ba')
  return [isVirtual]
}

const deviceRow = deviceItem => {
  const omitConds = omitConditions()
  const omitIf = anyPass(omitConds)
  const sn = propOr('', 'ConnDvcSn', deviceItem)
  if (omitIf(sn)) {
    return null
  } else {
    return (
      <div className="pt-5 pb-5 device-item" key={sn}>
        <span className="mt-5 mb-5 has-text-white">{sn}</span>
      </div>
    )
  }
}

const MetersGroup = ({ data }) => {
  const t = useI18n()

  const deviceList = removeUndefined(map(deviceRow, data))

  return (
    <div className="mt-10 mb-10">
      <Collapsible
        className="is-flex flex-column"
        title={t('METERS')}
        actions={length(deviceList)}
      >
        {either(
          length(data) > 0,
          deviceList,
          <span className="has-text-weight-bold">{t('NO_METERS_RMA')}</span>
        )}
        {either(
          length(data) > 0,
          <span className="mt-10 mb-10 has-text-weight-bold">
            {t('METERS_TRANSFER_DISCLAIMER')}
          </span>
        )}
      </Collapsible>
    </div>
  )
}

export default MetersGroup
