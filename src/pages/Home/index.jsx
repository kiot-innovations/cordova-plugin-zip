import React from 'react'
import Textfield from '@sunpower/textfield'
import { useI18n } from 'shared/i18n'
import './Home.scss'
import { paths } from 'routes/paths'

function Home() {
  const t = useI18n()

  return (
    <section className="home is-flex has-text-centered">
      <div className="section">
        <span className="sp-map has-text-white" />
        <h6 className="is-uppercase mt-20 mb-20">{t('SELECT_SITE')}</h6>
        <form action="">
          <Textfield input={{}} meta={{}} />
        </form>
      </div>
      <section>
        <p>{t('CS_NOT_FOUND')}</p>
        <a className="link is-uppercase" href={paths.PROTECTED.CREATE_SITE}>
          <small>{t('CREATE_SITE')}</small>
        </a>
      </section>
    </section>
  )
}

export default Home
