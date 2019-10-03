import React from 'react'
import { Redirect } from 'react-router-dom'
import paths from '../Router/paths'
import Logo from '../../components/Logo'
import BackButtonBar from '../../components/BackButtonBar'
import { useI18n } from '../../shared/i18n'
import { sendResetPasswordEmail } from '../../state/actions/auth'

import './ForgotPasswordSent.scss'

function onClick(history, email) {
  return async () => {
    try {
      const { status } = await sendResetPasswordEmail(email)
      if (status === 200) {
        history.push({
          pathname: paths.FORGOT_PASSWORD_SENT,
          state: {
            email,
            isResend: true
          }
        })
      } else {
        history.push({
          pathname: paths.FORGOT_PASSWORD_FAILED,
          state: {
            email
          }
        })
      }
    } catch (err) {
      history.push({
        pathname: paths.FORGOT_PASSWORD_FAILED,
        state: {
          error: err
        }
      })
    }
  }
}

function ForgotPasswordSent({
  isLoggedIn = false,
  location = {},
  history = {}
}) {
  const t = useI18n()
  const email = location.state && location.state.email
  const isResend = location.state && location.state.isResend

  if (isLoggedIn) {
    return <Redirect to={paths.ROOT} />
  }

  return (
    <section className="forgot-password section full-min-height is-flex">
      <BackButtonBar history={history} to={paths.LOGIN} />
      <div className="container mt-50 mb-100">
        <Logo />
        <div className="container is-spaced has-text-centered mt-40 title is-6">
          <h1>{t('CHECK_YOUR_INBOX')}</h1>
        </div>
        <div className="container is-spaced mt-30 has-text-centered subtitle is-6">
          <h2>
            {isResend
              ? t('FORGOT_PASSWORD_RESEND_TEXT', email)
              : t('FORGOT_PASSWORD_SENT_TEXT')}
          </h2>
        </div>
      </div>
      <div className="container is-spaced mt-100 has-text-centered">
        <span className="link" onClick={onClick(history, email)}>
          {t('RESEND_EMAIL')}
        </span>
      </div>
      <div className="container is-flex mt-50"></div>
    </section>
  )
}

export default ForgotPasswordSent
