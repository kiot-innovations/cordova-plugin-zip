import React from 'react'
import { useHistory } from 'react-router-dom'
import clsx from 'clsx'
import { isEmpty, length, pathOr, isNil, path } from 'ramda'
import SwipeableSheet from 'hocs/SwipeableSheet'
import { useI18n } from 'shared/i18n'
import { either, addHasErrorProp, warningsLength } from 'shared/utils'
import paths from 'routes/paths'

import { rmaModes } from 'state/reducers/rma'

import ESSHealthCheckReport from './ESSHealthCheckReport'
import ErrorDetected from 'components/ESSErrorDetected'
import ContinueFooter from 'components/ESSContinueFooter'

import './ESSHealthCheck.scss'
import { Loader } from '../Loader'

function ESSHealthCheck(props) {
  const t = useI18n()
  const history = useHistory()
  const results = addHasErrorProp(props.results)
  const errors = pathOr([], ['errors'], results)
  const report = path(['ess_report'], results)
  const loading = isNil(results) && !props.error
  const classes = clsx('ess-hc has-text-centered pt-10 pl-10 pr-10', {
    gridit: loading || props.error
  })
  const hasErrors = !isEmpty(errors) || props.error

  const statusErrorMessage = pathOr(
    props.error,
    ['error', 'response', 'body', 'result'],
    props
  )

  const {
    waiting,
    progress,
    onRetry,
    rmaMode,
    pathToContinue,
    pathToErrors,
    waitModal,
    showWaitModal,
    modelsWarning,
    toggleModelsWarning,
    warnMissingModels
  } = props

  return (
    <div className={classes}>
      <span className="is-uppercase has-text-weight-bold">
        {t('SYSTEM_CHECK')}
      </span>

      <div className="status-message">
        {either(
          waiting,
          progress !== 100 ? (
            <span className="discovery-percentage mb-20 has-text-weight-bold is-size-1 has-text-white">
              {progress || 0}%
            </span>
          ) : (
            <div>
              <Loader />
            </div>
          )
        )}
        {either(
          loading,
          <span>
            {t(progress !== 100 ? 'SYSTEM_REPORT' : 'POLLING_SYSTEM_CHECK')}
          </span>
        )}

        {either(
          !props.error && report,
          <ESSHealthCheckReport report={report} />
        )}
      </div>

      <SwipeableSheet
        open={waitModal}
        onChange={() => showWaitModal(!waitModal)}
      >
        <div className="check-in-progress is-flex">
          <span className="has-text-weight-bold">{t('HOLD_ON')}</span>
          <span className="mt-10 mb-10">{t('WAIT_FOR_CHECK')}</span>
          <div className="mt-10 mb-20">
            <button
              className="button is-primary"
              onClick={() => showWaitModal(false)}
            >
              {t('CLOSE')}
            </button>
          </div>
        </div>
      </SwipeableSheet>

      {either(
        hasErrors && !loading,
        <ErrorDetected
          number={length(errors) - warningsLength(errors)}
          warnings={warningsLength(errors)}
          onRetry={onRetry}
          url={pathToErrors}
          globalError={statusErrorMessage}
          next={pathToContinue}
          customAction={
            rmaMode === rmaModes.EDIT_DEVICES ? warnMissingModels : {}
          }
        />
      )}

      {either(
        !hasErrors && !loading,
        <ContinueFooter
          url={pathToContinue}
          text={t('SYSTEM_CHECK_SUCCESSFUL')}
        />
      )}

      <SwipeableSheet
        open={modelsWarning}
        onChange={() => toggleModelsWarning(!modelsWarning)}
      >
        <div className="is-flex flex-column has-text-white has-text-centered">
          <span className="has-text-weight-bold mb-10">
            {t('ALMOST_THERE')}
          </span>
          <span className="mb-10">{t('RMA_MISSING_MODELS')}</span>
          <div className="mt-10">
            <button
              className="button is-primary"
              onClick={() => history.push(paths.PROTECTED.MODEL_EDIT.path)}
            >
              {t('ASSIGN_MODELS')}
            </button>
          </div>
        </div>
      </SwipeableSheet>
    </div>
  )
}

export default ESSHealthCheck
