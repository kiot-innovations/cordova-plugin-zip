import React, { useState } from 'react'
import './ErrorListScreen.scss'
import { Link, useHistory } from 'react-router-dom'
import paths, { setParams } from 'routes/paths'
import { useI18n } from 'shared/i18n'
import { omit } from 'ramda'
import { getError } from 'shared/errorCodes'

const ErrorComponent = ({ title, code, errorInfo, t }) => (
  <div className="error-component">
    <h1 className="has-text-white has-text-weight-bold is-size-5 mb-10">
      {title}
    </h1>
    <span className="error-code"> {t('ERROR_CODE', code)}</span>

    <Link
      className="sp sp-chevron-right has-text-primary is-size-1 details"
      to={{
        pathname: setParams([code], paths.PROTECTED.ERROR_DETAIL.path),
        state: { ...errorInfo }
      }}
    />
  </div>
)

const getErrorInfo = omit([
  'error_message',
  'error_code',
  'error_code',
  'error_description',
  'event_code',
  'event_code'
])
/**
 *
 * @param errors array of errors {error_description,code,event_code}
 * @returns React.Component
 * @constructor
 */
const ErrorListScreen = ({ errors = [] }) => {
  const t = useI18n()
  const history = useHistory()
  const [parsedErrors] = useState(() =>
    errors.map(elem => getError(elem.error_code))
  )
  return (
    <div className="error-list-screen">
      {parsedErrors.map(elem => (
        <ErrorComponent
          title={elem.error_description || elem.error_message}
          code={elem.event_code || elem.error_code}
          key={elem.event_code || elem.error_code}
          errorInfo={getErrorInfo(elem)}
          t={t}
        />
      ))}
      <button
        className="button is-primary is-outlined is-center mt-10 mb-10"
        onClick={() => history.goBack()}
      >
        {t('GO_BACK')}
      </button>
      <div className="actions">
        <button className="button button-transparent has-text-primary is-uppercase mb-20 mt-20">
          {t('CANCEL_COMMISSION')}
        </button>
        <span className="mt-10 mb-10">{t('PLEASE_FIX_ERRORS')}</span>
        <span className="mb-20 mt-10">{t('GO_BACK_AND_FIX')}</span>
      </div>
    </div>
  )
}

export default ErrorListScreen
