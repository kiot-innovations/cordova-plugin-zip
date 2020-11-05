import React from 'react'
import { useHistory } from 'react-router-dom'
import paths from 'routes/paths'
import { useI18n } from 'shared/i18n'
import './GetAssistance.scss'
import { createExternalLinkHandler } from 'shared/routing'

function GetAssistance() {
  const t = useI18n()
  const history = useHistory()
  const goBack = () => history.push(paths.PROTECTED.ROOT.path)
  const mailto = 'mailto:partnerportal@sunpower.com'

  return (
    <section className="is-flex tile level is-vertical section pt-15 fill-parent">
      <h1 className="has-text-centered has-text-primary is-uppercase has-text-weight-bold  mb-20">
        {`${t('SUNPOWER')} ${t('APP_NAME')}`}
      </h1>

      <article className="assistance is-size-5">
        <p className="mb-15">{t('ASSISTANCE_1')}</p>

        <p className="mb-15">
          {t('ASSISTANCE_2')}
          <a
            href={mailto}
            className="ml-5 mr-5"
            onClick={createExternalLinkHandler(mailto)}
          >
            {t('ASSISTANCE_EMAIL')}
          </a>
          {t('ASSISTANCE_2.2')}
        </p>

        <p className="mb-15">
          {t('ASSISTANCE_3')}
          <a
            href={mailto}
            className="ml-5 mr-5"
            onClick={createExternalLinkHandler(mailto)}
          >
            {t('ASSISTANCE_EMAIL')}
          </a>
          {t('ASSISTANCE_3.1')}
        </p>
      </article>

      <button
        className="button button-transparent is-fullwidth is-outlined is-uppercase has-text-primary"
        onClick={goBack}
      >
        {t('GO_BACK')}
      </button>
    </section>
  )
}

export default GetAssistance
