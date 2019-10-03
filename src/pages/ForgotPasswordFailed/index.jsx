import React from 'react'
import { Redirect, Link } from 'react-router-dom'
import paths from '../Router/paths'
import Logo from '../../components/Logo'
import { useI18n } from '../../shared/i18n'

import './ForgotPasswordFailed.scss'

function ForgotPasswordFailed({ isLoggedIn = false }) {
  const t = useI18n()

  if (isLoggedIn) {
    return <Redirect to={paths.ROOT} />
  }

  return (
    <section className="forgot-password section full-min-height is-flex">
      <div className="container mt-50 mb-100">
        <Logo />
        <div className="container is-spaced has-text-centered mt-40 title is-6">
          <h1>{t('FORGOT_PASSWORD_FAILED')}</h1>
        </div>
        <div className="container is-spaced mt-30 has-text-centered subtitle is-6">
          <h2>{t('FORGOT_PASSWORD_FAILED_TEXT')}</h2>
        </div>
      </div>
      <div className="container is-spaced mt-100 has-text-centered">
        <Link className="link" to={{ pathname: paths.SIGNUP }}>
          {t('TAB_TITLE_SIGNUP')}
        </Link>
      </div>
    </section>
  )
}

export default ForgotPasswordFailed
