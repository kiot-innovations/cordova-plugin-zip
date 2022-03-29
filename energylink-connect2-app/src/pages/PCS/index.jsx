import clsx from 'clsx'
import { F, pipe, isNil, propOr } from 'ramda'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import SelectField from 'components/SelectField'
import SwipeableSheet from 'hocs/SwipeableSheet'
import paths from 'routes/paths'
import { useI18n, useI18nComponent } from 'shared/i18n'
import { either, generateRange, toAmpLabel, trace } from 'shared/utils'
import {
  FETCH_PCS_SETTINGS_INIT,
  SET_BREAKER_RATING,
  SET_BUSBAR_RATING,
  SET_ENABLE_PCS,
  SET_HUB_PLUS_BREAKER_RATING,
  SET_PCS_APPLIED,
  SUBMIT_PCS_SETTINGS_INIT
} from 'state/actions/pcs'

import './PCS.scss'

const busbarAndBreakerRatings = generateRange(50, 400, 5, toAmpLabel, [0])

const PowerControlSystem = () => {
  const t = useI18n()
  const history = useHistory()
  const dispatch = useDispatch()
  const i18nComponents = useI18nComponent()

  const {
    busBarRating,
    breakerRating,
    hubPlusBreakerRating,
    enablePCS,
    fetchingPCS,
    fetchPCSSettingsError,
    submittingPCS,
    submitPCSSettingsError,
    pcsApplied
  } = useSelector(state => state.pcs)

  const PCSEnabled = i18nComponents('PCSEnabled')
  const PCSDisabled = i18nComponents('PCSDisabled')

  const [validationError, setValidationError] = useState(null)
  const [hubValidationError, setHubValidationError] = useState(null)
  const [shouldOpenConfirmation, setShouldOpenConfirmation] = useState(false)

  const onSetSunvaultSettings = event => {
    event.preventDefault()
    setShouldOpenConfirmation(true)
  }

  const submitPCSSettings = () => {
    const payload = {
      busBarRating: propOr(busBarRating, 'value', busBarRating),
      breakerRating: propOr(breakerRating, 'value', breakerRating),
      hubPlusBreakerRating: propOr(
        hubPlusBreakerRating,
        'value',
        hubPlusBreakerRating
      ),
      enablePCS
    }
    dispatch(SUBMIT_PCS_SETTINGS_INIT(payload))
  }

  useEffect(() => {
    if (pcsApplied) history.push(paths.PROTECTED.STORAGE_PREDISCOVERY.path)
    SET_PCS_APPLIED(false)
  }, [pcsApplied, history])

  useEffect(() => {
    dispatch(FETCH_PCS_SETTINGS_INIT())
  }, [dispatch])

  const validateInputs = useCallback(() => {
    const bbr = propOr(busBarRating, 'value', busBarRating)
    const brr = propOr(breakerRating, 'value', breakerRating)
    const hbr = propOr(hubPlusBreakerRating, 'value', hubPlusBreakerRating)
    const ver = !isNil(bbr) && !isNil(brr) && bbr < brr
    const her = !isNil(bbr) && !isNil(hbr) && hbr > bbr
    setValidationError(ver)
    setHubValidationError(her)
  }, [busBarRating, breakerRating, hubPlusBreakerRating])

  useEffect(() => {
    validateInputs()
  }, [validateInputs])

  const preventContinue =
    isNil(busBarRating) ||
    isNil(breakerRating) ||
    isNil(hubPlusBreakerRating) ||
    validationError ||
    hubValidationError ||
    fetchingPCS ||
    fetchPCSSettingsError

  return (
    <section className="nec2020 pr-20 pl-20 page-height">
      <div className="has-text-weight-bold mb-20 is-flex">
        <button
          className="button button-transparent pl-0 pr-0 pt-0 has-text-white"
          onClick={history.goBack}
        >
          <i className="sp sp-chevron-left has-text-primary is-size-5 mt--10" />
        </button>
        <h4 className="has-text-white is-uppercase ml-10 has-text-centered auto">
          {t('SUNVAULT_SITE_SETTINGS')}
        </h4>

        <button
          className="button button-transparent pl-0 pr-0 pt-0 has-text-white"
          onClick={console.info}
        >
          <i className="sp sp-info has-text-primary is-size-5 mt--10" />
        </button>
      </div>

      <article>
        <h6 className="mb-10 has-text-weight-bold">
          {t('MAIN_SERVICE_PANEL')}
        </h6>
        <form onSubmit={onSetSunvaultSettings}>
          <div className="field mb-15">
            <div className="field-label">
              <label htmlFor="busbar_rating" className="label has-text-white">
                {t('BUS_BAR_RATING')}
                <span className="ml-5 pt-5 has-text-danger">*</span>
              </label>
            </div>
            <div className="field-body">
              <div className="field">
                <div className="control">
                  <SelectField
                    id="busbar_rating"
                    disabled={false}
                    onSelect={pipe(
                      trace('busbarrating'),
                      SET_BUSBAR_RATING,
                      dispatch
                    )}
                    isSearchable={false}
                    value={either(
                      busBarRating?.label,
                      busBarRating,
                      toAmpLabel(busBarRating)
                    )}
                    placeholder="Please select a value"
                    options={busbarAndBreakerRatings}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="field">
            <div className="field-label">
              <label htmlFor="breaker_rating" className="label has-text-white">
                {t('BREAKER_RATING')}
                <span className="ml-5 pt-5 has-text-danger">*</span>
              </label>
            </div>
            <div className="field-body">
              <div className="field">
                <div className="control">
                  <SelectField
                    id="breaker_rating"
                    disabled={false}
                    onSelect={pipe(SET_BREAKER_RATING, dispatch)}
                    value={either(
                      breakerRating?.label,
                      breakerRating,
                      toAmpLabel(breakerRating)
                    )}
                    isSearchable={false}
                    placeholder="Please select a value"
                    options={busbarAndBreakerRatings}
                  />
                  {either(
                    validationError,
                    <p className="mt-10 is-flex has-text-left has-text-danger">
                      <i className="sp-hey is-size-5 mr-10" />
                      {t('RATINGS_MISMATCH')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <hr className="mb-0 mt-0" />

          <h6 className="mt-15 mb-10 has-text-weight-bold">{t('HUB_PLUS')}</h6>

          <div className="field">
            <div className="field-label">
              <label
                htmlFor="hub_plus_breaker_rating"
                className="label has-text-white"
              >
                {t('BREAKER_RATING')}
                <span className="ml-5 pt-5 has-text-danger">*</span>
              </label>
            </div>
            <div className="field-body">
              <div className="field">
                <div className="control">
                  <SelectField
                    id="hub_plus_breaker_rating"
                    isSearchable={false}
                    disabled={false}
                    onSelect={pipe(SET_HUB_PLUS_BREAKER_RATING, dispatch)}
                    value={either(
                      hubPlusBreakerRating?.label,
                      hubPlusBreakerRating,
                      toAmpLabel(hubPlusBreakerRating)
                    )}
                    placeholder="Please select a value"
                    options={busbarAndBreakerRatings}
                  />
                  {either(
                    hubValidationError,
                    <p className="mt-10 is-flex has-text-left has-text-danger">
                      <i className="sp-hey is-size-5 mr-10" />
                      {t('RATINGS_MISMATCH_WITH_HUB_PLUS')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="field">
            <div className="field-label">
              <label htmlFor="enable_pcs" className="label has-text-white">
                {t('PCS')}
              </label>
            </div>

            <hr />

            <div className="checkbox has-text-white is-flex">
              <label htmlFor="enable_pcs" className="ml-5 mr-20">
                {t('ENABLE_PCS')}
              </label>

              <input
                type="checkbox"
                name="enable_pcs"
                id="enable_pcs"
                className="checkbox-dark is-primary"
                onChange={() => dispatch(SET_ENABLE_PCS(!enablePCS))}
                checked={enablePCS}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={preventContinue}
            className="button is-primary is-fullwidth is-uppercase mt-20"
          >
            {t('CONTINUE')}
          </button>
        </form>
      </article>

      <SwipeableSheet
        open={shouldOpenConfirmation}
        onChange={pipe(F, setShouldOpenConfirmation)}
      >
        <div className={clsx({ 'with-top-margin': enablePCS })}>
          <h6 className="has-text-centered is-uppercase has-text-weight-bold">
            {t('WARNING')}
          </h6>
          <h6 className="has-text-centered is-uppercase has-text-weight-bold">
            {t('SAFETY_STEP')}
          </h6>
          <h6 className="has-text-centered mb-10 has-text-weight-bold">
            {t('QUALIFIED')}
          </h6>

          {either(
            enablePCS,
            <PCSEnabled
              busbar={propOr(busBarRating, 'value', busBarRating)}
              breaker={propOr(breakerRating, 'value', breakerRating)}
              hubplus={propOr(
                hubPlusBreakerRating,
                'value',
                hubPlusBreakerRating
              )}
            />,
            <PCSDisabled />
          )}

          <div className="is-flex">
            <button
              type="button"
              onClick={console.info}
              className="button is-fullwidth is-uppercase is-outlined is-primary mr-10"
            >
              {t('LEARN_MORE')}
            </button>

            <button
              type="button"
              onClick={pipe(F, setShouldOpenConfirmation)}
              className="button is-fullwidth is-uppercase is-outlined is-primary ml-10"
            >
              {t('GO_BACK')}
            </button>
          </div>

          <button
            type="button"
            onClick={submitPCSSettings}
            className="button is-primary is-fullwidth is-uppercase mt-5"
          >
            {t('CONFIRM')}
          </button>
        </div>
      </SwipeableSheet>

      <SwipeableSheet
        open={fetchPCSSettingsError && !fetchingPCS}
        onChange={console.info}
      >
        <p className="has-text-centered">{t('ERROR_FETCHING_PCS_SETTINGS')}</p>

        <button
          type="button"
          onClick={pipe(FETCH_PCS_SETTINGS_INIT, dispatch)}
          disabled={fetchingPCS}
          className="button is-primary is-fullwidth is-uppercase mt-20"
        >
          {t('RETRY')}
        </button>
      </SwipeableSheet>

      <SwipeableSheet
        open={submitPCSSettingsError && !submittingPCS}
        onChange={console.info}
      >
        <p className="has-text-centered">
          {t('ERROR_SUBMITTING_PCS_SETTINGS')}
        </p>

        <button
          type="button"
          onClick={submitPCSSettings}
          disabled={submittingPCS}
          className="button is-primary is-fullwidth is-uppercase mt-20"
        >
          {submittingPCS ? t('SUBMITTING') : t('RETRY')}
        </button>
      </SwipeableSheet>
    </section>
  )
}

export default PowerControlSystem
