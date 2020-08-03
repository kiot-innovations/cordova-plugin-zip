import React from 'react'
import clsx from 'clsx'
import { isEmpty, length, pathOr, isNil, path } from 'ramda'
import { useI18n } from 'shared/i18n'
import { either, addHasErrorProp } from 'shared/utils'

import ESSHealthCheckReport from './ESSHealthCheckReport'
import ErrorDetected from 'components/ESSErrorDetected/ErrorDetected'
import ContinueFooter from 'components/ESSContinueFooter'

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

  const { waiting, progress, onRetry, pathToContinue, pathToErrors } = props

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
      </div>

      {either(
        isEmpty(errors) && !loading,
        <ContinueFooter
          url={pathToContinue}
          text={t('HEALTH_CHECK_SUCCESSFUL')}
        />
      )}

      {either(
        !isEmpty(errors) && !loading,
        <ErrorDetected
          url={pathToErrors}
          number={length(errors)}
          onRetry={onRetry}
        />
      )}
    </div>
  )
}

export default ESSHealthCheck
