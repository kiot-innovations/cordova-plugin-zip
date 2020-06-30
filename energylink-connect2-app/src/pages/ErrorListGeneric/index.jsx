import React from 'react'
import './ErrorListScreen.scss'
import { Link } from 'react-router-dom'
import paths, { setParams } from 'routes/paths'
import { useI18n } from 'shared/i18n'

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

/**
 *
 * @param errors array of errors {error_description,code,event_code}
 * @returns React.Component
 * @constructor
 */
const ErrorListScreen = ({ errors = [] }) => {
  const t = useI18n()
  return (
    <div className="error-list-screen">
      {errors.map(elem => (
        <ErrorComponent
          title={elem.error_description}
          code={elem.code}
          key={elem.event_code}
          errorInfo={elem.errorInfo}
          t={t}
        />
      ))}
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
