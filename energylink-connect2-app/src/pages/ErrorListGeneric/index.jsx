import React, { useState } from 'react'
import { omit, not } from 'ramda'
import { Link, useHistory } from 'react-router-dom'
import paths, { setParams } from 'routes/paths'
import { useI18n } from 'shared/i18n'
import { getError } from 'shared/errorCodes'
import { either } from 'shared/utils'
import './ErrorListGeneric.scss'

const ErrorComponent = ({ title, code = '', errorInfo, t }) => {
  const toParams = {
    pathname: setParams([code, errorInfo], paths.PROTECTED.ERROR_DETAIL.path),
    state: { ...errorInfo }
  }

  return (
    <div className="error-component mb-10">
      <div className="error-text">
        <h1 className="has-text-white has-text-weight-bold is-size-5 mb-10">
          {title}
        </h1>
        <p className="error-code"> {t('ERROR_CODE', code)}</p>
        {either(
          not(`${code}`.startsWith('1')),
          <p className="has-text-primary has-text-weight-bold">
            {t('FIX_ERROR_TO_PROCEED')}
          </p>
        )}
      </div>
      <div>
        <Link className="has-text-primary details is-flex" to={toParams}>
          <span className="sp sp-chevron-right auto is-size-2" />
        </Link>
      </div>
    </div>
  )
}

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
  const [parsedErrors] = useState(() => errors.map(getError))
  return (
    <div className="error-list-screen pr-10 pl-10">
      <div className="error-list-container">
        {parsedErrors.map(elem => (
          <ErrorComponent
            title={elem.error_description || elem.error_message}
            code={elem.event_code || elem.error_code}
            key={elem.event_code || elem.error_code}
            errorInfo={getErrorInfo(elem)}
            t={t}
          />
        ))}
      </div>
      <div className="mt-10">
        <div className="has-text-centered">
          <button
            className="button is-primary is-outlined is-center"
            onClick={history.goBack}
          >
            {t('GO_BACK')}
          </button>
        </div>
        <div className="has-text-centered">
          <button className="button button-transparent has-text-primary is-uppercase mb-20 mt-20">
            {t('CANCEL_COMMISSION')}
          </button>
        </div>
        <div className="has-text-centered error-list-hint">
          <span className="mt-10">{t('PLEASE_FIX_ERRORS')}</span>
          <span>{t('GO_BACK_AND_FIX')}</span>
        </div>
      </div>
    </div>
  )
}

export default ErrorListScreen
