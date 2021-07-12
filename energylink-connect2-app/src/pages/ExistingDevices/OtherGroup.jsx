import { length, map, propOr } from 'ramda'
import React from 'react'

import Collapsible from 'components/Collapsible'
import { useI18n } from 'shared/i18n'
import './ExistingDevices.scss'

const deviceRow = deviceItem => {
  const sn = propOr('', 'ConnDvcSn', deviceItem)
  const type = propOr('Unknown', 'DvcTy', deviceItem)
  return (
    <div className="pt-5 pb-5 device-item is-flex" key={sn}>
      <span className="has-text-white">{sn}</span>
      <span className="has-text-weight-bold">{type}</span>
    </div>
  )
}

const OtherGroup = ({ data }) => {
  const t = useI18n()

  const deviceList = map(deviceRow, data)

  return (
    <div className="mt-10 mb-10">
      <Collapsible
        className="is-flex flex-column"
        title={t('OTHER_DEVICES')}
        actions={length(data)}
      >
        {deviceList}
      </Collapsible>
    </div>
  )
}

export default OtherGroup
