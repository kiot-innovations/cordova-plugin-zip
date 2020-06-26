import React from 'react'
import clsx from 'clsx'
import { useI18n } from 'shared/i18n'
import { Loader } from '../Loader'
import { cond, isNil, always, equals, T } from 'ramda'
import './ConnectedDeviceUpdate.scss'

const status = {
  PENDING: 'FWUP_PENDING',
  INPROGRESS: 'FWUP_INPROGRESS',
  COMPLETED: 'FWUP_COMPLETED',
  ERROR: 'FWUP_ERROR'
}

const getStatus = cond([
  [isNil, always(status.ERROR)],
  [equals(0), always(status.PENDING)],
  [equals(100), always(status.COMPLETED)],
  [T, always(status.INPROGRESS)]
])

function ConnectedDeviceUpdate({ device }) {
  const t = useI18n()
  const updateStatus = device.error ? status.ERROR : getStatus(device.progress)

  const fwVersionClass = clsx(
    { 'has-text-white': updateStatus === status.COMPLETED },
    'has-text-weight-bold'
  )

  const percentageClass = clsx(
    { 'error-colored': updateStatus === status.ERROR },
    { 'has-text-white': updateStatus === status.COMPLETED },
    'percentage has-text-weight-bold is-size-1'
  )

  return (
    <div className="device-updating mb-10 mt-10">
      <div className="device-info">
        <span className="has-text-white has-text-weight-bold">
          {device.device_type}
        </span>
        <span className="has-text-weight-bold">{device.serial_number}</span>
        <span className={fwVersionClass}>
          {updateStatus === status.COMPLETED
            ? device.fw_ver_to
            : device.fw_ver_from}
        </span>
      </div>
      <div className="device-updateprog">
        {updateStatus === status.PENDING ? (
          <Loader outerClass="height-100" />
        ) : (
          <div className="device-updatepercentage">
            <span className={fwVersionClass}>{t(updateStatus)}</span>
            <span className={percentageClass}>{device.progress}%</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default ConnectedDeviceUpdate
