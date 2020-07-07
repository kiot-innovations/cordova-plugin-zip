import React from 'react'
import Collapsible from 'components/Collapsible'
import 'pages/Devices/Devices.scss'
import { useI18n } from 'shared/i18n'

const renderDevice = device => (
  <div className="eqs-device is-flex is-vertical has-text-white pt-5 pb-5">
    <span>{device.serial_number}</span>
    <span className="has-text-weight-bold ml-10"> {device.device_type} </span>
  </div>
)
function StorageDevices({ devices }) {
  const t = useI18n()
  return (
    <div className="mt-5 mb-5">
      <Collapsible expanded title={t('AIO_COMPONENTS')}>
        {devices.map(renderDevice)}
      </Collapsible>
    </div>
  )
}

export default StorageDevices
