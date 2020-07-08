import React from 'react'
import clsx from 'clsx'
import { isEmpty, length, pathOr, isNil, path } from 'ramda'
import { useI18n } from 'shared/i18n'
import { either, addHasErrorProp } from 'shared/utils'

import ESSHealthCheckReport from './ESSHealthCheckReport'
import './ESSHealthCheck.scss'

function ESSHealthCheck(props) {
  const t = useI18n()
  const results = addHasErrorProp(props.results)
  const errors = pathOr([], ['errors'], results)
  const report = path(['ess_report'], results)
  const loading = isNil(results) && !props.error
  const classes = clsx('ess-hc page-height has-text-centered pt-10', {
    gridit: loading || props.error
  })

  const { waiting, progress, onContinue, onRetry, onSeeErrors } = props

  return (
    <div className={classes}>
      <span className="is-uppercase has-text-weight-bold">
        {t('HEALTH_CHECK')}
      </span>

      <div className="status-message">
        {either(
          waiting,
          <span className="discovery-percentage mb-20 has-text-weight-bold is-size-1 has-text-white">
            {progress || 0}%
          </span>
        )}
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
            <div className="are-small mt-20">
              <button className="button auto is-secondary" onClick={onRetry}>
                {t('RETRY')}
              </button>
            </div>
          </>
        )}
      </div>

      {either(
        isEmpty(errors) && !loading && !props.error,
        <div className="are-small">
          <button
            className={clsx('button auto is-primary')}
            onClick={onContinue}
          >
            {t('CONTINUE')}
          </button>
        </div>
      )}

      {either(
        !isEmpty(errors) && !loading && !props.error,
        <>
          <div className="info is-size-7">
            <p className="is-size-6 has-text-primary">
              {t('HEALTH_REPORT_ERROR_COUNT', length(errors))}
            </p>
            <p> {t('HEALTH_REPORT_ERROR_INFO')} </p>
            <p> {t('HEALTH_REPORT_ERROR_INFO2')} </p>
          </div>

          <div className="buttons are-small">
            <button
              className="button is-primary is-uppercase auto"
              onClick={onSeeErrors}
            >
              {t('HEALTH_REPORT_ERROR_LIST')}
            </button>
            <button className="button is-secondary auto" onClick={onRetry}>
              {t('RETRY')}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default ESSHealthCheck
