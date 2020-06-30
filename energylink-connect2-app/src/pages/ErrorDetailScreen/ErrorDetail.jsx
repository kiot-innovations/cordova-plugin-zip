import marked from 'marked'
import { compose, equals, filter, length, propOr, props } from 'ramda'
import React from 'react'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import { getError } from 'shared/errorCodes'
import { useI18n } from 'shared/i18n'
import { either } from 'shared/utils'
import './ErrorDetail.scss'

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
const BackButton = () => {
  const history = useHistory()
  return (
    <button
      className="button is-primary is-outlined is-center mt-10 mb-10"
      onClick={() => history.goBack()}
    >
      Go back
    </button>
  )
}

function createMarkup(recommendedAction) {
  return { __html: marked(recommendedAction) }
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
  const { time, affectedDevices, apiResponse } = propOr(
    {},
    'state',
    useLocation()
  )
  const code = getError(errorCode)
  const t = useI18n()
  if (shouldShowError(code))
    return (
      <main className="error-detail-screen">
        <BackButton />
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
          <span>{code.possible_causes}</span>
        </div>
        <div className="mt-10 mb-10 ml-10 mr-10">
          {either(
            code.recommended_actions,
            <>
              <h1 className="has-text-white is-size-5 has-text-weight-bold mb-10">
                {t('ACTIONS')}
              </h1>
              <div
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
        <BackButton />
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
      <BackButton />
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
