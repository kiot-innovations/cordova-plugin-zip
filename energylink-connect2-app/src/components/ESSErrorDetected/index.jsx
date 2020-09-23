import React from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from 'shared/i18n'
import { either } from 'shared/utils'
import './ErrorDetected.scss'

function ErrorDetected({
  number = 0,
  warnings = 0,
  url = '',
  next = '',
  globalError = '',
  onRetry
}) {
  const t = useI18n()
  if (number === 0 && warnings === 0 && !globalError) return null
  return (
    <div className="error-list-detected pl-20 pr-20">
      {either(
        number === 0 && warnings === 0,
        <>
          <p className="has-text-primary has-text-weight-bold has-text-centered mb-10 is-size-6">
            {t('ERRORS_DETECTED', 1)}
          </p>
          <p className="has-text-centered">{globalError}</p>
          <button
            className="button is-primary is-outlined is-uppercase mt-20 is-fullwidth ml-5"
            onClick={onRetry}
          >
            {t('RETRY')}
          </button>
        </>,
        <>
          <p className="has-text-primary has-text-weight-bold has-text-centered mb-10 is-size-6">
            {either(number > 0, t('ERRORS_DETECTED', number))} &nbsp;
            {either(
              warnings > 0,
              number > 0
                ? t('WARNINGS_DETECTED', warnings)
                : t('WARNINGS_ONLY', warnings)
            )}
          </p>
          <p className="has-text-centered">{t('FIX_ERRORS')}</p>
          <div className="is-flex level">
            <Link
              className="button is-primary is-outlined is-uppercase mt-20 is-fullwidth mr-5"
              to={url}
            >
              {t(number > 0 ? 'ERROR_LIST' : 'WARNING_LIST')}
            </Link>
            <button
              className="button is-primary is-uppercase mt-20 is-fullwidth ml-5"
              onClick={onRetry}
            >
              {t('RETRY')}
            </button>
          </div>
        </>
      )}

      {either(
        number === 0 && !globalError,
        <Link
          className="button is-primary is-outlined is-uppercase mt-10 is-fullwidth"
          to={next}
        >
          {t('IGNORE_WARNINGS')}
        </Link>
      )}
    </div>
  )
}

export default ErrorDetected
