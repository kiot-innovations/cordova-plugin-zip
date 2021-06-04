import React, { useEffect, useRef, useState } from 'react'
import { useI18n } from 'shared/i18n'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { includes, isEmpty, length, map, pathOr, pluck, prop } from 'ramda'
import SwipeableSheet from 'hocs/SwipeableSheet'
import {
  CHECK_EQS_FIRMWARE,
  TRIGGER_EQS_FIRMWARE_UPDATE_INIT
} from 'state/actions/storage'
import { Loader } from 'components/Loader'
import { either, warningsLength, withoutInfoCodes } from 'shared/utils'
import { eqsSteps } from 'state/reducers/storage'
import {
  eqsUpdateErrors,
  eqsUpdateStates
} from 'state/epics/storage/deviceUpdate'
import ConnectedDeviceUpdate from 'components/ConnectedDeviceUpdate'
import ContinueFooter from 'components/ESSContinueFooter'
import ErrorDetected from 'components/ESSErrorDetected'
import paths from 'routes/paths'
import './EQSUpdate.scss'

const renderUpdateComponent = device => (
  <ConnectedDeviceUpdate device={device} />
)

const checkForErrors = (errorList, devices) => {
  const affectedDevices = pluck('device_sn', errorList)
  return devices.map(device => {
    if (
      device.progress < 0 ||
      (includes(device.serial_number, affectedDevices) &&
        !isEmpty(device.serial_number))
    ) {
      device.progress = device.progress < 0 ? 0 : device.progress
      device.error = true
    }
    return device
  })
}

const EQSUpdate = ({ history }) => {
  const t = useI18n()
  const dispatch = useDispatch()
  const historyRouter = useHistory()
  const unblockHandle = useRef()
  const [modal, showModal] = useState(false)

  const { currentStep, error } = useSelector(prop('storage'))

  const isUpdating = includes(currentStep, [
    eqsSteps.FW_UPLOAD,
    eqsSteps.FW_UPDATE,
    eqsSteps.FW_POLL
  ])

  useEffect(() => {
    if (
      !includes(currentStep, [
        eqsSteps.FW_UPLOAD,
        eqsSteps.FW_UPDATE,
        eqsSteps.FW_POLL,
        eqsSteps.FW_ERROR,
        eqsSteps.FW_COMPLETED
      ])
    ) {
      dispatch(CHECK_EQS_FIRMWARE())
    }
  }, [currentStep, dispatch])

  useEffect(() => {
    unblockHandle.current = history.block(() => {
      if (isUpdating) {
        showModal(true)
        return false
      }
    })
    return function() {
      unblockHandle.current && unblockHandle.current()
    }
  })

  const updateProgress = useSelector(
    pathOr([], ['storage', 'deviceUpdate', 'status_report'])
  )

  const updateStatus = useSelector(
    pathOr('', ['storage', 'deviceUpdate', 'firmware_update_status'])
  )

  const updateErrors = useSelector(
    pathOr([], ['storage', 'deviceUpdate', 'errors'])
  )

  const noInfo = withoutInfoCodes(updateErrors)
  const warningsCount = warningsLength(noInfo)
  const errorsDetected = length(noInfo) - warningsCount

  const updatingDevices = checkForErrors(updateErrors, updateProgress)

  return (
    <div className="eqs-fw-update pl-10 pr-10">
      <div className="has-text-centered mb-25">
        <span className="has-text-weight-bold is-uppercase">
          {t('FW_UPDATE')}
        </span>
      </div>

      {either(
        isEmpty(updateStatus) && isEmpty(error),
        <div className="has-text-centered">
          <Loader />
          <span>{t('FW_UPDATE_WAIT')}</span>
        </div>
      )}

      {either(
        includes(error, [
          eqsUpdateErrors.CHECKFILE_EQS_FIRMWARE_ERROR,
          eqsUpdateErrors.GETFILE_EQS_FIRMWARE_ERROR,
          eqsUpdateErrors.UPLOAD_EQS_FIRMWARE_ERROR
        ]),
        <div className="has-text-centered mb-15">
          <div className="pt-20 pb-20">
            <i className="sp-close has-text-white is-size-1" />
          </div>
          <div className="mt-20">
            <span>{t(error)}</span>
            <div className="mt-20">
              <button
                className="button is-primary is-outlined"
                onClick={() =>
                  historyRouter.push(paths.PROTECTED.MANAGE_FIRMWARES.path)
                }
              >
                {t('MANAGE_FIRMWARES')}
              </button>
            </div>

            <div className="mt-20">
              <button
                onClick={() => dispatch(CHECK_EQS_FIRMWARE())}
                className="button is-primary"
              >
                {t('RETRY')}
              </button>
            </div>
          </div>
        </div>,
        either(
          includes(updateStatus, [
            eqsUpdateStates.FAILED,
            eqsUpdateStates.NOT_RUNNING
          ]) && isEmpty(updateErrors),
          <div className="has-text-centered mb-15">
            <div className="pt-20 pb-20">
              <i className="sp-close has-text-white is-size-1" />
            </div>
            <div className="mt-20">
              <span>{t('EQS_UPDATE_ERROR')}</span>
            </div>
            <div className="mt-20 has-text-centered">
              <button
                onClick={() => dispatch(TRIGGER_EQS_FIRMWARE_UPDATE_INIT())}
                className="button is-primary"
              >
                {t('RETRY')}
              </button>
            </div>
          </div>
        )
      )}
      {either(
        !isEmpty(updatingDevices),
        <div>{map(renderUpdateComponent, updatingDevices)}</div>
      )}

      {either(
        error === eqsUpdateErrors.TRIGGER_EQS_FIRMWARE_ERROR &&
          isEmpty(updateStatus),
        <div className="has-text-centered mb-15">
          <div className="pt-20 pb-20">
            <i className="sp-close has-text-white is-size-1" />
          </div>
          <div className="mt-20">
            <span>{t('EQS_UPDATE_TRIGGER_ERROR')}</span>
          </div>
          <div className="mt-20">
            <button
              onClick={() => dispatch(TRIGGER_EQS_FIRMWARE_UPDATE_INIT())}
              className="button is-primary"
            >
              {t('RETRY')}
            </button>
          </div>
        </div>
      )}

      {either(
        updateStatus === eqsUpdateStates.SUCCEEDED && isEmpty(updateErrors),
        <ContinueFooter
          url={paths.PROTECTED.ESS_DEVICE_MAPPING.path}
          text={'EQS_FW_UPDATE_SUCCESS'}
        />,
        <ErrorDetected
          number={errorsDetected}
          warnings={warningsCount}
          onRetry={() => dispatch(CHECK_EQS_FIRMWARE())}
          url={paths.PROTECTED.EQS_UPDATE_ERRORS.path}
          next={paths.PROTECTED.ESS_DEVICE_MAPPING.path}
        />
      )}

      <SwipeableSheet open={modal} onChange={() => showModal(!modal)}>
        <div className="update-in-progress is-flex">
          <span className="has-text-weight-bold">{t('HOLD_ON')}</span>
          <span className="mt-10 mb-10">{t('WAIT_FOR_UPDATE')}</span>
          <div className="mt-10 mb-20">
            <button
              className="button is-primary"
              onClick={() => showModal(false)}
            >
              {t('CLOSE')}
            </button>
          </div>
        </div>
      </SwipeableSheet>
    </div>
  )
}

export default EQSUpdate
