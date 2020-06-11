import React from 'react'
import { isEmpty, length } from 'ramda'
import { Link } from 'react-router-dom'
import { useI18n } from 'shared/i18n'
import { either } from 'shared/utils'
import { Loader } from 'components/Loader'

import paths from 'routes/paths'

import './ESSHealthCheckErrorList.scss'

function ESSHealthCheck(props) {
  const t = useI18n()

  return (
    <div className="ess-hc page-height has-text-centered pt-10">
      <span className="is-uppercase has-text-weight-bold">
        {t('HEALTH_CHECK')}
      </span>

      <div className="status-message">
        {either(
          isEmpty(props.errors),
          <Loader />,
          <div className="pt-20 pb-20">
            <i className="sp-close has-text-white is-size-1" />
          </div>
        )}

        {either(
          isEmpty(props.errors),
          <span> {t('HEALTH_REPORT')} </span>,
          <span> {t('HEALTH_REPORT_ERROR')} </span>
        )}
      </div>

      <div className="info is-size-7">
        <Link
          to={paths.PROTECTED.ESS_HEALTH_CHECK_ERRORS.path}
          className="is-size-6"
        >
          {t('HEALTH_REPORT_ERROR_COUNT', length(props.errors))}
        </Link>
        <p> {t('HEALTH_REPORT_ERROR_INFO')} </p>
        <p> {t('HEALTH_REPORT_ERROR_INFO2')} </p>
      </div>

      <div className="buttons are-small">
        <button className="button is-primary is-uppercase auto">
          {t('HEALTH_REPORT_ERROR_LIST')}
        </button>
        <button className="button is-secondary auto">{t('RETRY')}</button>
      </div>
    </div>
  )
}

export default ESSHealthCheck
