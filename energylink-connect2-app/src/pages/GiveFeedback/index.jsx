import React from 'react'
import clsx from 'clsx'
import { useField, useForm } from 'react-final-form-hooks'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'

import Rating from 'components/Rating'
import TextArea from 'components/TextArea'
import paths from 'routes/paths'
import { useI18n } from 'shared/i18n'
import { SEND_FEEDBACK_INIT } from 'state/actions/feedback'
import { cleanString } from 'shared/utils'

const onSubmit = dispatch => values => {
  const sanitizedValues = { ...values, comment: cleanString(values.comment) }
  return dispatch(SEND_FEEDBACK_INIT(sanitizedValues))
}

const changeRate = form => value => form.change('rating', value)

function GiveFeedback() {
  const t = useI18n()
  const dispatch = useDispatch()
  const isSendingFeedback = useSelector(state => state.global.isSendingFeedback)
  const isFeedbackSuccessful = useSelector(
    state => state.global.isFeedbackSuccessful
  )
  const error = useSelector(state => state.global.feedbackError)

  const { form, handleSubmit } = useForm({
    onSubmit: onSubmit(dispatch),
    initialValues: {
      rating: 1,
      comment: ''
    }
  })

  const comment = useField('comment', form)
  const rating = useField('rating', form)

  if (isFeedbackSuccessful) return <Redirect to={paths.PROTECTED.ROOT.path} />

  const submitClassnames = clsx('button', 'is-uppercase', 'is-primary', {
    'is-loading': isSendingFeedback
  })

  return (
    <section className="is-flex tile is-vertical section pt-0 fill-parent">
      <h1 className="has-text-centered is-uppercase has-text-weight-bold  pb-20">
        {t('GIVE_FEEDBACK')}
      </h1>

      <form onSubmit={handleSubmit} className="mt-20 pt-20">
        <label htmlFor="rate" className="has-text-white">
          {t('RATE_APP')}
        </label>
        <Rating onClick={changeRate(form)} rating={rating.input.value} />
        <article className="mb-15">
          <label htmlFor="feedback" className="has-text-white">
            {t('GIVE_FEEDBACK')}
          </label>
          <TextArea
            input={comment.input}
            meta={comment.meta}
            placeholder={t('PLACEHOLDER_FEEDBACK')}
          />
        </article>

        <div className="is-flex file level space-around section pt-0">
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
    </section>
  )
}

export default GiveFeedback
