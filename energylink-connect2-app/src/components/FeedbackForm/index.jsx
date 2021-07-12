import clsx from 'clsx'
import React from 'react'
import { useField, useForm } from 'react-final-form-hooks'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import Rating from 'components/Rating'
import TextArea from 'components/TextArea'
import routes from 'routes/paths'
import { useI18n } from 'shared/i18n'
import { cleanString } from 'shared/utils'
import { SEND_FEEDBACK_INIT } from 'state/actions/feedback'
import { MENU_HIDE } from 'state/actions/ui'

const onSubmit = dispatch => values => {
  const sanitizedValues = { ...values, comment: cleanString(values.comment) }
  return dispatch(SEND_FEEDBACK_INIT(sanitizedValues))
}

const changeRate = form => value => form.change('rating', value)

function FeedbackForm({
  title,
  placeholder,
  modal,
  ratingPreset,
  onRatingChange,
  handleFeedbackSuccess
}) {
  const t = useI18n()
  const history = useHistory()
  const dispatch = useDispatch()
  const isSendingFeedback = useSelector(state => state.global.isSendingFeedback)
  const isFeedbackSuccessful = useSelector(
    state => state.global.isFeedbackSuccessful
  )
  const error = useSelector(state => state.global.feedbackError)

  const { form, handleSubmit } = useForm({
    onSubmit: onSubmit(dispatch),
    initialValues: {
      rating: ratingPreset || 1,
      comment: ''
    }
  })

  const rating = useField('rating', form)
  const comment = useField('comment', form)

  form.change('source', modal ? 'Commissioning Success' : 'Menu')

  if (!modal && isFeedbackSuccessful) {
    dispatch(MENU_HIDE())
    history.push(routes.PROTECTED.ROOT.path)
  }

  if (modal && isFeedbackSuccessful) {
    handleFeedbackSuccess()
  }

  const submitClassnames = clsx('button', 'is-uppercase', 'is-primary', {
    'is-loading': isSendingFeedback
  })

  return (
    <form onSubmit={handleSubmit} className="mt-20 pt-20">
      <div className="has-text-centered has-text-white has-text-weight-bold mb-5">
        {title}
      </div>
      <Rating
        onClick={modal ? onRatingChange : changeRate(form)}
        rating={modal ? ratingPreset : rating.input.value}
      />

      <TextArea
        input={comment.input}
        meta={comment.meta}
        placeholder={placeholder}
      />

      <div className="is-flex file level space-around pt-0 mt-20">
        <button
          className={submitClassnames}
          disabled={isSendingFeedback}
          type="submit"
        >
          {t('SUBMIT')}
        </button>
      </div>
      {error ? (
        <div className="message error mb-10 mt-10">
          <p className="pl-20 pr-20">{t('FEEDBACK_ERROR')}</p>
        </div>
      ) : null}
    </form>
  )
}

export default FeedbackForm
