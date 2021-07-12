import { anyPass, length, map, endsWith, reject, isNil, propOr } from 'ramda'
import React from 'react'

import Collapsible from 'components/Collapsible'
import { useI18n } from 'shared/i18n'
import { either } from 'shared/utils'
import './ExistingDevices.scss'

// Add conditions here to omit devices from the results

const omitConditions = () => {
  const isEsmm = endsWith('esmm')
  return [isEsmm]
}

const deviceRow = deviceItem => {
  const omitConds = omitConditions()
  const omitIf = anyPass(omitConds)
  const sn = propOr('', 'ConnDvcSn', deviceItem)
  const type = propOr('Unknown', 'DvcTy', deviceItem)
  if (omitIf(sn)) {
    return null
  } else {
    return (
      <div className="pt-5 pb-5 device-item is-flex" key={sn}>
        <span className="has-text-white">{sn}</span>
        <span className="has-text-weight-bold">{type}</span>
      </div>
    )
  }
}

const StorageGroup = ({ data }) => {
  const t = useI18n()
  const deviceList = map(deviceRow, data)
  const filteredList = reject(isNil, deviceList)

  return (
    <div className="mt-10 mb-10">
      <Collapsible
        className="is-flex flex-column"
        title={t('STORAGE_DEVICES')}
        actions={length(filteredList)}
      >
        {either(
          length(filteredList) > 0,
          filteredList,
          <span className="has-text-weight-bold">{t('NO_STORAGE_RMA')}</span>
        )}
      </Collapsible>
    </div>
  )
}

export default StorageGroup
