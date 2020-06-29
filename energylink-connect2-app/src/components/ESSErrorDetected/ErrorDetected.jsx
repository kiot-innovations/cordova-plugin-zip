import React from 'react'
import './ErrorDetected.scss'
import { Link } from 'react-router-dom'
import paths from 'routes/paths'
import { useI18n } from 'shared/i18n'

/**
 *
 * @param number
 * @param url
 * @param onRetry Function
 * @returns {null|React.Component}
 * @constructor
 */
const ErrorDetected = ({ number = 0, url = '', onRetry }) => {
  const t = useI18n()
  if (number === 0) return null
  return (
    <div className="error-list-detected">
      <span className="has-text-primary has-text-weight-bold mb-10 is-size-5">
        {t('ERRORS_DETECTED', number)}
      </span>
      <span>{t('FIX_ERRORS')}</span>
      <div>
        <Link
          className="button is-primary is-uppercase pl-20 pr-20 mt-20"
          to={url}
        >
          {t('ERROR_LIST')}
        </Link>
        <button
          className="button button-transparent is-uppercase pl-20 pr-20 is-transparent mt-20"
          onClick={onRetry}
        >
          {t('RETRY')}
        </button>
      </div>
    </div>
  )
}

export default ErrorDetected
