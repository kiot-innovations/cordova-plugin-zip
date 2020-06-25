import React from 'react'
import { isEmpty, length, pathOr, isNil, path } from 'ramda'
import { Link } from 'react-router-dom'
import { useI18n } from 'shared/i18n'
import { either } from 'shared/utils'
import { Loader } from 'components/Loader'

import paths from 'routes/paths'
import ESSHealthCheckReport from './ESSHealthCheckReport'
import './ESSHealthCheck.scss'
import clsx from 'clsx'

function ESSHealthCheck(props) {
  const t = useI18n()
  const errors = pathOr([], ['results', 'errors'], props)
  const report = path(['results', 'ess_report'], props)
  const loading = isNil(props.results) && !props.error
  const classes = clsx('ess-hc page-height has-text-centered pt-10', {
    gridit: loading || props.error
  })

  return (
    <div className={classes}>
      <span className="is-uppercase has-text-weight-bold">
        {t('HEALTH_CHECK')}
      </span>

      <div className="status-messageee">
        {either(loading, <Loader />)}
        {either(loading, <span> {t('HEALTH_REPORT')} </span>)}

        {either(
          !props.error && report,
          <ESSHealthCheckReport report={report} />
        )}

        {either(
          !loading && props.error,
          <>
            <div className="pt-20 pb-20">
              <i className="sp-close has-text-white is-size-1" />
            </div>
            <span> {t('HEALTH_REPORT_ERROR')} </span>
          </>
        )}
      </div>

      {either(
        !isEmpty(errors),
        <>
          <div className="info is-size-7">
            <Link
              to={paths.PROTECTED.ESS_HEALTH_CHECK_ERRORS.path}
              className="is-size-6"
            >
              {t('HEALTH_REPORT_ERROR_COUNT', length(errors))}
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
        </>
      )}
    </div>
  )
}

export default ESSHealthCheck
