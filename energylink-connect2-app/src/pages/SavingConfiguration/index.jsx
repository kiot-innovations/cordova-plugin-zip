import { isEmpty, test, pathOr, propOr } from 'ramda'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import PanelLayoutToolSavingStatus from './PanelLayoutToolSavingStatus'

import FeedbackModal from 'components/FeedbackModal'
import HomeownerAccountCreation from 'components/HomeownerAccountCreation'
import { Loader } from 'components/Loader'
import Rating from 'components/Rating'
import paths from 'routes/paths'
import { useI18n } from 'shared/i18n'
import { either, buildFullAddress } from 'shared/utils'
import { STOP_NETWORK_POLLING } from 'state/actions/network'
import { CREATE_HOMEOWNER_ACCOUNT_RESET } from 'state/actions/site'
import {
  ALLOW_COMMISSIONING,
  SUBMIT_CLEAR
} from 'state/actions/systemConfiguration'

import './SavingConfiguration.scss'

const SavingConfiguration = () => {
  const t = useI18n()
  const history = useHistory()
  const dispatch = useDispatch()
  const unblockHandle = useRef()
  const [showHomeownerCreation, setShowHomeownerCreation] = useState(false)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [feedbackRating, setFeedbackRating] = useState(0)
  const [feedbackSent, setFeedbackSent] = useState(false)
  const markFeedbackAsSent = () => setFeedbackSent(true)
  const { submitting, commissioned, error } = useSelector(
    state => state.systemConfiguration.submit
  )

  const site = useSelector(pathOr(false, ['site', 'site']))
  const address = propOr('', 'address1', site).trim()
  const address2 = propOr('', 'address2', site).trim()
  const city = propOr('', 'city', site).trim()
  const st_id = propOr('', 'st_id', site).trim()

  const fullAddress = buildFullAddress(address, address2, st_id, city)

  const commissioningPvs = useSelector(pathOr('', ['pvs', 'serialNumber']))

  const errorMap = e =>
    test(/database|table|foreign/gi, e) ? t('DATABASE_ERROR') : e

  const goToChangeAddress = () => {
    dispatch(STOP_NETWORK_POLLING())
    history.push(paths.PROTECTED.ROOT.path)
  }

  const goToConfig = () => {
    dispatch(SUBMIT_CLEAR())
    dispatch(ALLOW_COMMISSIONING())
    history.push(paths.PROTECTED.SYSTEM_CONFIGURATION.path)
  }

  const goToData = () => {
    dispatch(SUBMIT_CLEAR())
    history.push(paths.PROTECTED.DATA.path)
  }

  const handleFeedbackRating = rating => {
    setShowFeedbackModal(true)
    setFeedbackRating(rating)
  }

  const configContent =
    commissioned && isEmpty(error)
      ? {
          title: t('SUCCESS'),
          indicator: (
            <div className="pt-20 pb-20 success">
              <i className="sp-pvs has-text-white success_icon" />
            </div>
          ),
          controls: (
            <div className="success status-message">
              <div className="status-message is-flex tile is-vertical">
                <span className="has-text-white has-text-weight-bold">
                  {t('COMMISSIONING_SUCCESS')}
                </span>
                <span className="has-text-white">{fullAddress}</span>
              </div>
              <PanelLayoutToolSavingStatus />
              {either(
                !isEmpty(commissioningPvs),
                <button
                  onClick={() => setShowHomeownerCreation(true)}
                  className="button is-secondary is-uppercase"
                >
                  {t('CREATE_HOMEOWNER_ACCOUNT')}
                </button>
              )}
              {either(
                !feedbackSent,
                <>
                  <div className="mt-15 has-text-white has-text-weight-bold">
                    {t('COMMISSIONING_SUCCESS_FEEDBACK_REQUEST')}
                  </div>

                  <Rating
                    onClick={handleFeedbackRating}
                    rating={feedbackRating}
                  />
                </>
              )}
              <div className="inline-buttons">
                <button
                  onClick={goToChangeAddress}
                  className="button is-secondary is-uppercase"
                >
                  {t('EXIT_SITE')}
                </button>
                <button
                  onClick={goToData}
                  className="button is-primary is-uppercase"
                >
                  {t('LIVE_DATA')}
                </button>
              </div>
              {either(
                !isEmpty(commissioningPvs),
                <HomeownerAccountCreation
                  open={showHomeownerCreation}
                  onChange={() => {
                    setShowHomeownerCreation(!showHomeownerCreation)
                    dispatch(CREATE_HOMEOWNER_ACCOUNT_RESET())
                  }}
                />
              )}
            </div>
          )
        }
      : {
          title: t('CONFIG_ERROR'),
          indicator: (
            <div className="pt-20 pb-20">
              <i className="sp-hey has-text-white is-size-1" />
            </div>
          ),
          controls: (
            <div className="status-message">
              <span>{t('CONFIG_ERROR_2')}</span>
              {either(
                !isEmpty(error),
                <div className="error-message mt-5 mb-5">
                  <span>{errorMap(error)}</span>
                </div>
              )}
              <div className="has-text-centered">
                <button
                  onClick={goToConfig}
                  className="button is-primary is-uppercase"
                >
                  {t('RETRY')}
                </button>
              </div>
            </div>
          )
        }

  useEffect(() => {
    unblockHandle.current = history.block(() => {
      dispatch(SUBMIT_CLEAR())
    })
    return function() {
      unblockHandle.current && unblockHandle.current()
    }
  })

  return (
    <div className="saving-configuration has-text-centered pt-20 pr-20 pl-20">
      <span className="is-uppercase has-text-weight-bold">
        {submitting ? t('HOLD_ON') : configContent.title}
      </span>

      {submitting ? <Loader /> : configContent.indicator}

      {submitting ? (
        <div className="status-message">
          <span> {t('SAVING_CONFIGURATION')} </span>
          <span className="has-text-weight-bold">{t('DONT_CLOSE_APP')}</span>
        </div>
      ) : (
        configContent.controls
      )}
      <FeedbackModal
        rating={feedbackRating}
        open={showFeedbackModal}
        onRatingChange={setFeedbackRating}
        feedbackSent={feedbackSent}
        handleFeedbackSuccess={markFeedbackAsSent}
        onChange={() => {
          setShowFeedbackModal(!showFeedbackModal)
        }}
      />
    </div>
  )
}

export default SavingConfiguration
