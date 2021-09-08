import React from 'react'

import FeedbackForm from 'components/FeedbackForm'
import Rating from 'components/Rating'
import SwipeableSheet from 'hocs/SwipeableSheet'
import { useFeatureFlag } from 'shared/featureFlags'
import { useI18n } from 'shared/i18n'
import { isIos, either } from 'shared/utils'

import './FeedbackModal.scss'

const FeedbackModal = ({
  open,
  onRatingChange,
  onChange,
  rating,
  feedbackSent,
  handleFeedbackSuccess
}) => {
  const t = useI18n()
  const appId = isIos()
    ? process.env.REACT_APP_APPLE_ID
    : process.env.REACT_APP_ANDROID_ID
  const closeModal = () => onChange()

  const storeReviewsAllowed = useFeatureFlag({
    page: 'commissioning-success',
    name: 'appstore-reviews-request'
  })

  const inModalFeedbackForm = (
    <div className="mt-10 mb-20">
      <FeedbackForm
        title={t('FEEDBACK_MODAL_TITLE')}
        placeholder={t('FEEDBACK_MODAL_PLACEHOLDER')}
        modal
        ratingPreset={rating}
        onRatingChange={onRatingChange}
        handleFeedbackSuccess={handleFeedbackSuccess}
      />
    </div>
  )

  const inModalFeedbackSuccessfullySent = (
    <>
      <div className="mt-10 mb-20 has-text-white has-text-weight-bold">
        {t('FEEDBACK_SUCCESSFULLY_SENT')}
      </div>

      <div className="mt-20 mb-20">
        <div className="has-text-centered">
          <button
            className="button is-primary is-uppercase"
            onClick={closeModal}
          >
            {t('OK')}
          </button>
        </div>
      </div>
    </>
  )

  const inModalStoreReview = (
    <>
      <Rating rating={rating} />

      <div className="mt-10 mb-20 has-text-white has-text-weight-bold">
        {t(
          either(
            isIos(),
            'FEEDBACK_MODAL_APP_STORE_REVIEW_REQUEST',
            'FEEDBACK_MODAL_GOOGLE_PLAY_REVIEW_REQUEST'
          )
        )}
      </div>

      <div className="mt-20 mb-20">
        <div className="inline-buttons">
          <button
            className="button is-primary is-uppercase is-outlined"
            onClick={closeModal}
          >
            {t('NOT_NOW')}
          </button>

          <button
            className="button is-primary is-uppercase"
            onClick={() => {
              closeModal()
              window.LaunchReview.launch(null, null, appId)
            }}
          >
            {t('GO_TO_STORE')}
          </button>
        </div>
      </div>
    </>
  )

  const modalContent = either(
    feedbackSent,
    either(
      storeReviewsAllowed && rating >= 4,
      inModalStoreReview,
      inModalFeedbackSuccessfullySent
    ),
    inModalFeedbackForm
  )

  return (
    <SwipeableSheet open={open} onChange={onChange} style={{ zIndex: '9999' }}>
      <div className="feedback-modal has-text-centered">{modalContent}</div>
    </SwipeableSheet>
  )
}

export default FeedbackModal
