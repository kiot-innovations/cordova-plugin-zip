import React, { useCallback, useEffect, useState } from 'react'
import { useI18n } from 'shared/i18n'
import { useDispatch, useSelector } from 'react-redux'
import { path, pathOr, map, length, includes, values, isEmpty } from 'ramda'
import { UPLOAD_EQS_FIRMWARE } from 'state/actions/storage'
import { Loader } from 'components/Loader'
import { getFileBlob } from 'shared/fileSystem'
import { either } from 'shared/utils'
import { eqsSteps } from 'state/reducers/storage'
import { eqsUpdateErrors } from 'state/epics/storage/deviceUpdate'
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
  const possibleErrors = values(eqsUpdateErrors)

  /*----------------------------
  fileReady
  0 = Checking file availability
  1 = File not available
  2 = File available, uploading
  ------------------------------*/
  const [fileReady, setFileReady] = useState(0)
  const { error } = useSelector(path(['storage']))

  const startUpdate = useCallback(async () => {
    setFileReady(0)
    try {
      const file = await getFileBlob('/ESS/EQS-FW-Package.zip')
      dispatch(UPLOAD_EQS_FIRMWARE(file))
      setFileReady(2)
    } catch {
      setFileReady(1)
    }
  }, [dispatch])

  const { currentStep } = useSelector(path(['storage']))

  useEffect(() => {
    if (
      !includes(currentStep, [
        eqsSteps.FW_UPLOAD,
        eqsSteps.FW_UPDATE,
        eqsSteps.FW_POLL
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
      {fileReady !== 2 && includes(error, possibleErrors) && (
        <div className="has-text-centered">
          <div className="pt-20 pb-20">
            <i className="sp-close has-text-white is-size-1" />
          </div>
          <div className="mt-20">
            <span>{t('EQS_UPDATE_ERROR')}</span>
          </div>
          <div className="mt-20 has-text-centered">
            <button onClick={startUpdate} className="button is-primary">
              {t('RETRY')}
            </button>
          </div>
        </div>
      )}
      {fileReady === 1 && (
        <div className="has-text-centered pl-10 pr-10">
          <div className="pt-20 pb-20">
            <i className="sp-close has-text-white is-size-1" />
          </div>
          <div className="mt-20">
            <span>{t('EQS_FILE_NOTREADY')}</span>
          </div>
        </div>
      )}
      {either(
        fileReady === 2 && !isEmpty(updateProgress),
        <div>{map(renderUpdateComponent, updateProgress)}</div>,
        <div className="has-text-centered">
          <Loader />
          <span>{t('FW_UPDATE_WAIT')}</span>
        </div>
      )}
      {either(
        fileReady === 2 &&
          includes(updateStatus, ['FAILED', 'SUCCEEDED']) &&
          isEmpty(updateErrors),
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
