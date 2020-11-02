import React from 'react'
import { useHistory } from 'react-router-dom'
import paths from 'routes/paths'
import { useI18n } from 'shared/i18n'

function GiveAssistance() {
  const t = useI18n()
  const history = useHistory()
  const goBack = () => history.push(paths.PROTECTED.ROOT.path)

  return (
    <section className="is-flex tile is-vertical section pt-0 fill-parent">
      <h1 className="has-text-centered is-uppercase has-text-weight-bold  pb-20">
        {`${t('SUNPOWER')} ${t('APP_NAME')}`}
      </h1>

      <article className="has-text-justified">
        <p className="mb-15">{t('ASSISTANCE_1')}</p>

        <p className="mb-15">
          {t('ASISTANCE_2')}
          <a href="mailto:partnerportal@sunpower.com" className="ml-5 mr-5">
            {t('ASISTANCE_EMAIL')}
          </a>
          {t('ASISTANCE_2.2')}
        </p>

        <p className="mb-15">
          {t('ASISTANCE_3')}
          <a href="mailto:partnerportal@sunpower.com" className="ml-5 mr-5">
            {t('ASISTANCE_EMAIL')}
          </a>
          {t('ASISTANCE_3.1')}
        </p>

        <button className="button is-fullwidth is-outlined" onClick={goBack}>
          {t('GO_BACK')}
        </button>
      </article>
    </section>
  )
}

export default GiveAssistance
