import { compose, equals, filter, length, propOr, props } from 'ramda'
import React from 'react'
import { useSelector } from 'react-redux'
import { useHistory, useLocation, useParams } from 'react-router-dom'

import paths from 'routes/paths'
import { getError } from 'shared/errorCodes'
import { useI18n } from 'shared/i18n'
import { createMarkup, either } from 'shared/utils'
import { eqsSteps } from 'state/reducers/storage'
import './ErrorDetail.scss'

const storageRoutesMap = {
  [eqsSteps.PREDISCOVERY]: paths.PROTECTED.EQS_PREDISCOVERY_ERRORS.path,
  [eqsSteps.FW_UPLOAD]: paths.PROTECTED.EQS_UPDATE_ERRORS.path,
  [eqsSteps.FW_ERROR]: paths.PROTECTED.EQS_UPDATE_ERRORS.path,
  [eqsSteps.FW_COMPLETED]: paths.PROTECTED.EQS_UPDATE_ERRORS.path,
  [eqsSteps.FW_POLL]: paths.PROTECTED.EQS_UPDATE_ERRORS.path,
  [eqsSteps.FW_UPDATE]: paths.PROTECTED.EQS_UPDATE_ERRORS.path,
  [eqsSteps.COMPONENT_MAPPING]:
    paths.PROTECTED.ESS_DEVICE_MAPPING_ERROR_LIST.path,
  [eqsSteps.HEALTH_CHECK]: paths.PROTECTED.ESS_HEALTH_CHECK_ERRORS.path
}

const AffectedDevices = ({ devices, t }) => (
  <>
    <span className="is-size-7">{t('AFFECTED_DEVICES')}:</span>
    <ul>
      {devices.map(device => (
        <li key={device}>-{device}</li>
      ))}
    </ul>
  </>
)
const BackButton = ({ currentStep }) => {
  const history = useHistory()
  const t = useI18n()
  return (
    <button
      className="button is-primary is-outlined is-center mt-10 mb-10"
      onClick={() => history.push(storageRoutesMap[currentStep])}
    >
      {t('GO_BACK')}
    </button>
  )
}

const shouldShowError = compose(
  equals(2),
  length,
  filter(Boolean),
  props(['in_use', 'display'])
)
const hasEventCode = propOr(false, 'event_code')

const ErrorDetailScreen = () => {
  const { errorCode } = useParams()
  const {
    error_name,
    last_occurrence,
    device_sn,
    time,
    affectedDevices,
    apiResponse
  } = propOr({}, 'state', useLocation())
  const { currentStep } = useSelector(state => state.storage)

  const errorObject = {
    error_code: errorCode,
    error_message: error_name,
    device_sn,
    time: last_occurrence,
    affectedDevices,
    apiResponse
  }
  const code = getError(errorObject)
  const t = useI18n()
  if (shouldShowError(code))
    return (
      <main className="error-detail-screen">
        <BackButton currentStep={currentStep} />
        <div className="affected-devices">
          <h1 className="has-text-white is-size-5 has-text-weight-bold mb-10">
            {code.error_description}
          </h1>
          <span className="is-size-7">{t('ERROR_CODE', code.event_code)}</span>
          {time && <span>{time}</span>}
          {affectedDevices && (
            <AffectedDevices devices={affectedDevices} t={t} />
          )}
        </div>
        <div className="mt-10 mb-10 ml-10 mr-10">
          <h1 className="has-text-white is-size-5 has-text-weight-bold mb-10">
            {t('POSSIBLE_CAUSES')}
          </h1>
          <div
            className="error-info"
            dangerouslySetInnerHTML={createMarkup(code.possible_causes)}
          />
        </div>
        <div className="mt-10 mb-10 ml-10 mr-10">
          {either(
            code.recommended_actions,
            <>
              <h1 className="has-text-white is-size-5 has-text-weight-bold mb-10">
                {t('ACTIONS')}
              </h1>
              <div
                className="error-info"
                dangerouslySetInnerHTML={createMarkup(code.recommended_actions)}
              />
            </>
          )}
        </div>
      </main>
    )
  if (hasEventCode(code) || !shouldShowError(code))
    return (
      <main className="error-detail-screen">
        <BackButton currentStep={currentStep} />
        <div className="mt-10 mb-10 ml-10 mr-10">
          <h1 className="has-text-white is-size-5 has-text-weight-bold mb-10">
            {t('API_RESPONSE')}
          </h1>
          {either(
            apiResponse,
            <span>{apiResponse}</span>,
            <span>{t('UNKNOWN_ERROR')}</span>
          )}
        </div>
      </main>
    )
  return (
    <main className="error-detail-screen">
      <BackButton currentStep={currentStep} />
      <div className="mt-10 mb-10 ml-10 mr-10">
        <h1 className="has-text-white is-size-5 has-text-weight-bold mb-10">
          {t('UNKNOWN_ERROR')}
        </h1>
        <span>{t('UNKNOWN_ERROR')}</span>
      </div>
    </main>
  )
}
export default ErrorDetailScreen
