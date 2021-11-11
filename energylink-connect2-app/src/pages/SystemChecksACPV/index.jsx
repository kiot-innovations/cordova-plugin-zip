import { pathOr, length } from 'ramda'
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { Loader } from 'components/Loader'
import StatusBox from 'components/StatusBox'
import paths from 'routes/paths'
import { useI18n } from 'shared/i18n'
import { capitalize, either, trimWarnings } from 'shared/utils'
import {
  RESET_SYSTEM_CHECKS,
  SYSTEM_CHECKS_INIT
} from 'state/actions/systemChecks'
import { SUBMIT_COMMISSION_INIT } from 'state/actions/systemConfiguration'
import { SYSTEM_CHECKS_STATUS } from 'state/reducers/systemChecks'

import './SystemChecksACPV.scss'

function SystemChecksACPV() {
  const t = useI18n()
  const dispatch = useDispatch()
  const history = useHistory()

  const {
    productionCTProgress,
    productionCTErrors,
    productionCTStatus,
    consumptionCTProgress,
    consumptionCTErrors,
    consumptionCTStatus,
    overallStatus,
    overallErrors
  } = useSelector(pathOr({}, ['systemChecks']))

  const showSummary =
    overallStatus === SYSTEM_CHECKS_STATUS.SUCCEEDED ||
    overallStatus === SYSTEM_CHECKS_STATUS.FAILED

  const pctErrorsLength = length(trimWarnings(productionCTErrors))
  const cctErrorsLength = length(trimWarnings(consumptionCTErrors))
  const overallErrorsLength = length(trimWarnings(overallErrors))
  const sumErrors = pctErrorsLength + cctErrorsLength + overallErrorsLength

  const hasErrors = sumErrors > 0

  const productionCT = {
    text: getText(pctErrorsLength, productionCTStatus, t),
    indicator: getIndicator(productionCTStatus, productionCTProgress),
    title: t('PRODUCTION_CTE')
  }

  const consumptionCT = {
    text: getText(cctErrorsLength, consumptionCTStatus, t),
    indicator: getIndicator(consumptionCTStatus, consumptionCTProgress),
    title: t('CONSUMPTION_CTE')
  }

  const generalErrors = {
    text: getText(overallErrorsLength, overallStatus, t),
    indicator: getIndicator(overallStatus, 100),
    title: t('GENERAL_CTE')
  }

  const isRunning = overallStatus === SYSTEM_CHECKS_STATUS.RUNNING

  useEffect(() => {
    if (overallStatus === SYSTEM_CHECKS_STATUS.NOT_RUNNING)
      dispatch(SYSTEM_CHECKS_INIT())
  }, [dispatch, overallStatus])

  const commission = () => {
    dispatch(SUBMIT_COMMISSION_INIT())
    history.push(paths.PROTECTED.SAVING_CONFIGURATION.path)
  }

  const restartChecks = () => {
    dispatch(RESET_SYSTEM_CHECKS())
    dispatch(SYSTEM_CHECKS_INIT())
  }

  return (
    <main className="page-height system-checks pl-10 pr-10">
      <header className="is-clearfix has-text">
        <button
          className="button is-text is-paddingless is-borderless has-text-grey has-text-weight-bold is-pulled-left is-size-6"
          disabled={isRunning}
          onClick={history.goBack}
        >
          <i className="sp-chevron-left has-text-primary is-size-5 mr-5 mt-5" />
          {t('SYSTEM_CHECKS')}
        </button>

        <button
          className="button is-text is-paddingless is-borderless has-text-grey has-text-weight-bold is-pulled-right is-size-6"
          disabled={isRunning}
          onClick={restartChecks}
        >
          <i className="sp-update left has-text-primary is-size-5 mr-5 mt-5" />
          {!isRunning
            ? t('RUN_AGAIN')
            : capitalize(SYSTEM_CHECKS_STATUS.RUNNING)}
        </button>
      </header>

      <section className="mt-20">
        <StatusBox {...productionCT} />
        <StatusBox {...consumptionCT} />

        {either(
          overallErrorsLength > 0 && !isRunning,
          <StatusBox {...generalErrors} />
        )}

        {either(
          hasErrors,
          <p className="has-text-primary is-size-6 has-text-centered">
            {t('SYSTEM_CHECKS_ERRORS', sumErrors)}
          </p>
        )}

        {either(isRunning, <Loader />)}
      </section>

      {either(
        showSummary,
        either(
          hasErrors,

          <section className="mt-10">
            <section className="is-flex is-vertical">
              <button
                className="button is-primary is-outlined is-uppercase mt-20 is-fullwidth mr-5 is-fullwidth"
                onClick={() =>
                  history.push(paths.PROTECTED.SYSTEM_CONFIGURATION.path)
                }
              >
                {t('BACK_TO_SETTINGS')}
              </button>
              <button
                className="button is-primary is-uppercase mt-20 is-fullwidth ml-5 is-fullwidth"
                onClick={() =>
                  history.push(paths.PROTECTED.SYSTEM_CHECKS_ERROR_LIST.path)
                }
              >
                {t('VIEW_ERRORS')}
              </button>
            </section>
            <button
              className="button is-primary is-outlined is-uppercase mt-20 is-fullwidth mr-5"
              onClick={() => history.push(paths.PROTECTED.DATA.path)}
            >
              {t('GO_TO_LIVE_DATA')}
            </button>
          </section>,

          <section className="mt-10">
            <section className="is-flex">
              <button
                className="button is-primary is-outlined is-uppercase mt-20 is-fullwidth mr-5"
                onClick={() => history.push(paths.PROTECTED.DATA.path)}
              >
                {t('GO_TO_LIVE_DATA')}
              </button>
              <button
                className="button is-primary is-uppercase mt-20 is-fullwidth ml-5 is-fullwidth"
                onClick={commission}
              >
                {t('COMMISSION')}
              </button>
            </section>
          </section>
        )
      )}
    </main>
  )
}

const getText = (
  errorsCount = 0,
  status = SYSTEM_CHECKS_STATUS.NOT_RUNNING,
  t
) =>
  either(
    errorsCount > 0,
    <span className="has-text-primary">
      {errorsCount === 1 ? t('ERROR_FOUND') : t('ERRORS_FOUND', errorsCount)}
    </span>,
    capitalize(t(status))
  )

const getIndicator = (status, percent = 0) =>
  either(
    status === SYSTEM_CHECKS_STATUS.FAILED ||
      status === SYSTEM_CHECKS_STATUS.UNSUPPORTED,
    <span className="sp-hey has-text-primary is-size-2" />,
    `${percent}%`
  )

export default SystemChecksACPV
