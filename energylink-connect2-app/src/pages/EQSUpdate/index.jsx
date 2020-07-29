import React, { useEffect } from 'react'
import { useI18n } from 'shared/i18n'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { includes, isEmpty, length, map, pathOr, prop } from 'ramda'

import { CHECK_EQS_FIRMWARE } from 'state/actions/storage'
import { Loader } from 'components/Loader'
import { either } from 'shared/utils'
import { eqsSteps } from 'state/reducers/storage'
import {
  eqsUpdateErrors,
  eqsUpdateStates
} from 'state/epics/storage/deviceUpdate'
import ConnectedDeviceUpdate from 'components/ConnectedDeviceUpdate'
import ContinueFooter from 'components/ESSContinueFooter'
import ErrorDetected from 'components/ESSErrorDetected/ErrorDetected'
import paths from 'routes/paths'

const renderUpdateComponent = device => (
  <ConnectedDeviceUpdate device={device} />
)

const EQSUpdate = () => {
  const t = useI18n()
  const dispatch = useDispatch()
  const history = useHistory()

  const { currentStep, error } = useSelector(prop('storage'))

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

  const updateProgress = useSelector(
    pathOr([], ['storage', 'deviceUpdate', 'status_report'])
  )

  const updateStatus = useSelector(
    pathOr('', ['storage', 'deviceUpdate', 'firmware_update_status'])
  )

  const updateErrors = useSelector(
    pathOr([], ['storage', 'deviceUpdate', 'errors'])
  )

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
                  history.push(paths.PROTECTED.MANAGE_FIRMWARES.path)
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
        </div>
      )}

      {either(
        includes(updateStatus, [
          eqsUpdateStates.FAILED,
          eqsUpdateStates.NOT_RUNNING
        ]) && !isEmpty(updateErrors),
        <div className="has-text-centered mb-15">
          <div className="pt-20 pb-20">
            <i className="sp-close has-text-white is-size-1" />
          </div>
          <div className="mt-20">
            <span>{t('EQS_UPDATE_ERROR')}</span>
          </div>
        </div>
      )}

      {either(
        includes(updateStatus, [
          eqsUpdateStates.FAILED,
          eqsUpdateStates.NOT_RUNNING
        ]) && !isEmpty(updateErrors),
        <div className="mt-20 has-text-centered">
          <button
            onClick={() => dispatch(CHECK_EQS_FIRMWARE())}
            className="button is-primary"
          >
            {t('RETRY')}
          </button>
        </div>
      )}

      {either(
        !isEmpty(updateProgress),
        <div>{map(renderUpdateComponent, updateProgress)}</div>
      )}

      {either(
        updateStatus === eqsUpdateStates.SUCCEEDED && isEmpty(updateErrors),
        <ContinueFooter
          url={paths.PROTECTED.ESS_DEVICE_MAPPING.path}
          text={'EQS_FW_UPDATE_SUCCESS'}
        />,
        <ErrorDetected
          url={paths.PROTECTED.EQS_UPDATE_ERRORS.path}
          number={length(updateErrors)}
          onRetry={() => dispatch(CHECK_EQS_FIRMWARE())}
        />
      )}
    </div>
  )
}

export default EQSUpdate
