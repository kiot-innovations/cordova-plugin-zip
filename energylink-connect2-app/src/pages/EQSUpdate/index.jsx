import React, { useCallback, useEffect } from 'react'
import { useI18n } from 'shared/i18n'
import { useDispatch, useSelector } from 'react-redux'
import { path, pathOr, map, length, includes, isEmpty } from 'ramda'
import { UPLOAD_EQS_FIRMWARE } from 'state/actions/storage'
import { Loader } from 'components/Loader'
import { getFileBlob } from 'shared/fileSystem'
import { either } from 'shared/utils'
import { eqsSteps } from 'state/reducers/storage'
import { eqsUpdateStates } from 'state/epics/storage/deviceUpdate'
import ConnectedDeviceUpdate from 'components/ConnectedDeviceUpdate'
import ContinueFooter from 'components/ESSContinueFooter'
import ErrorDetected from 'components/ESSErrorDetected/ErrorDetected'
import paths from 'routes/paths'
import * as Sentry from '@sentry/browser'

const renderUpdateComponent = device => (
  <ConnectedDeviceUpdate device={device} />
)

const EQSUpdate = () => {
  const t = useI18n()
  const dispatch = useDispatch()

  const startUpdate = useCallback(async () => {
    try {
      const file = await getFileBlob('/ESS/EQS-FW-Package.zip')
      dispatch(UPLOAD_EQS_FIRMWARE(file))
    } catch (err) {
      Sentry.captureException(new Error(err))
    }
  }, [dispatch])

  const { currentStep } = useSelector(path(['storage']))

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
      startUpdate()
    }
  }, [currentStep, startUpdate])

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
        isEmpty(updateStatus),
        <div className="has-text-centered">
          <Loader />
          <span>{t('FW_UPDATE_WAIT')}</span>
        </div>
      )}

      {either(
        includes(updateStatus, [
          eqsUpdateStates.FAILED,
          eqsUpdateStates.NOT_RUNNING
        ]),
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
        includes(
          updateStatus,
          [eqsUpdateStates.FAILED, eqsUpdateStates.NOT_RUNNING] &&
            isEmpty(updateErrors),
          <div className="mt-20 has-text-centered">
            <button onClick={startUpdate} className="button is-primary">
              {t('RETRY')}
            </button>
          </div>
        )
      )}

      {either(
        !isEmpty(updateProgress),
        <div>{map(renderUpdateComponent, updateProgress)}</div>
      )}

      {either(
        updateStatus === eqsUpdateStates.SUCCEEDED && isEmpty(updateErrors),
        <ContinueFooter
          url={paths.PROTECTED.ESS_HEALTH_CHECK.path}
          text={'EQS_FW_UPDATE_SUCCESS'}
        />,
        <ErrorDetected
          url={paths.PROTECTED.EQS_UPDATE_ERRORS.path}
          number={length(updateErrors)}
          onRetry={startUpdate}
        />
      )}
    </div>
  )
}

export default EQSUpdate
