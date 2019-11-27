/* eslint-disable jsx-a11y/heading-has-content */
import React from 'react'
import Logo from '@sunpower/sunpowerimage'
import { Link } from 'react-router-dom'
import { useI18n } from '../../shared/i18n'
import paths from 'routes/paths'
import './NotFound.scss'

function NotFound() {
  const t = useI18n()

  return (
    <>
      <header className="not-found is-flex file level is-marginless">
        <div className="auto">
          <Logo />
        </div>
      </header>
      <section className="section is-flex level">
        <h6 className="has-text-centered has-text-white"></h6>
        <div className="ops has-text-centered">
          <h1 className="is-size-1">{t('404_TITLE')}</h1>
          <p className="section">{t('404_TEXT')}</p>
        </div>

        <div className="mb-40">
          <Link to={paths.PROTECTED.ROOT.path}>{t('404_BACK')}</Link>
        </div>
      </section>
    </>
  )
}

export default NotFound
