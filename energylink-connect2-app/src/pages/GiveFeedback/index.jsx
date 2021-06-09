import React from 'react'

import FeedbackForm from 'components/FeedbackForm'
import { useI18n } from 'shared/i18n'

function GiveFeedback() {
  const t = useI18n()

  return (
    <section className="is-flex tile is-vertical section pt-0 fill-parent">
      <h1 className="has-text-centered is-uppercase has-text-weight-bold  pb-20">
        {t('GIVE_FEEDBACK')}
      </h1>

      <FeedbackForm
        title={t('RATE_APP')}
        placeholder={t('GIVE_FEEDBACK_PAGE_PLACEHOLDER')}
      />
    </section>
  )
}

export default GiveFeedback
