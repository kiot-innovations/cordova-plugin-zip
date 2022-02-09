import clsx from 'clsx'
import { includes, pathOr } from 'ramda'
import React, { useEffect, useState } from 'react'
import { useField, useForm } from 'react-final-form-hooks'
import { useDispatch, useSelector } from 'react-redux'

import Rating from 'components/Rating'
import TextArea from 'components/TextArea'
import SwipeableSheet from 'hocs/SwipeableSheet'
import { useFeatureFlag } from 'shared/featureFlags'
import { useI18n } from 'shared/i18n'
import { cleanString, either } from 'shared/utils'
import {
  FEATURE_FEEDBACK_MODAL_OPEN,
  SEND_FEEDBACK_INIT
} from 'state/actions/feedback'

const FeatureFeedbackModal = ({
  featureFlagName,
  open,
  placeholder,
  title
}) => {
  const t = useI18n()
  const dispatch = useDispatch()

  const zIndex = { zIndex: '9999' }

  const FEATURE_FLAG_PAGE = 'feature-feedback'
  const showFeedbackForm = useFeatureFlag({
    page: FEATURE_FLAG_PAGE,
    name: featureFlagName
  })
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)

  const [feedbackSent, setFeedbackSent] = useState(false)

  const onSubmit = values => {
    const { comment } = values
    const sanitizedValues = { ...values, comment: cleanString(comment) }

    dispatch(SEND_FEEDBACK_INIT(sanitizedValues))
  }
  const changeRate = value => form.change('rating', value)

  const { form, handleSubmit } = useForm({
    onSubmit,
    initialValues: {
      comment: '',
      feature: true,
      rating: 1,
      source: `${FEATURE_FLAG_PAGE}/${featureFlagName}`
    }
  })
  const ratingField = useField('rating', form)
  const commentField = useField('comment', form)
  const { value: ratingValue } = ratingField.input
  const { input: commentInput, meta: commentMeta } = commentField

  const isSendingFeedback = useSelector(
    pathOr(false, ['global', 'isSendingFeedback'])
  )
  const feedbackSuccessfullySent = useSelector(
    pathOr(false, ['global', 'isFeedbackSuccessful'])
  )
  const sendingFeedbackError = useSelector(
    pathOr(false, ['global', 'feedbackError'])
  )
  const alreadyShownModals = useSelector(
    pathOr([], ['featureFeedback', 'alreadyShownModals'])
  )

  const submitClassnames = clsx('button', 'is-uppercase', 'is-primary', {
    'is-loading': isSendingFeedback
  })

  if (!feedbackSent && feedbackSuccessfullySent) {
    setFeedbackSent(true)
  }

  useEffect(() => {
    if (
      open &&
      showFeedbackForm &&
      !includes(featureFlagName, alreadyShownModals)
    ) {
      setShowFeedbackModal(true)
      dispatch(FEATURE_FEEDBACK_MODAL_OPEN({ featureFlagName }))
    }
  }, [alreadyShownModals, dispatch, featureFlagName, open, showFeedbackForm])

  return (
    <SwipeableSheet
      open={showFeedbackModal && !feedbackSent}
      onChange={() => setShowFeedbackModal(!showFeedbackModal)}
      style={zIndex}
    >
      <div className="feedback-modal has-text-centered mt-10 mb-20">
        <form onSubmit={handleSubmit} className="mt-20 pt-20">
          <div className="has-text-centered has-text-white has-text-weight-bold mb-5">
            {title}
          </div>

          <Rating onClick={changeRate} rating={ratingValue} />

          <TextArea
            input={commentInput}
            meta={commentMeta}
            placeholder={placeholder}
          />

          <div className="is-flex file level space-around pt-0 mt-20">
            <button className={submitClassnames} type="submit">
              {t('SUBMIT')}
            </button>
          </div>

          {either(
            sendingFeedbackError,
            <div className="message error mb-10 mt-10">
              <p className="pl-20 pr-20">{t('FEEDBACK_ERROR')}</p>
            </div>,
            null
          )}
        </form>
      </div>
    </SwipeableSheet>
  )
}

export default FeatureFeedbackModal
