import React from 'react'
import { Redirect, Link } from 'react-router-dom'
import { useForm, useField } from 'react-final-form-hooks'
import paths from '../Router/paths'
import Logo from '../../components/Logo'
import TextField from '../../components/TextField'
import { trimObject } from '../../shared/trim'
import { useI18n } from '../../shared/i18n'
import { sendResetPasswordEmail } from '../../state/actions/auth'

import './ForgotPassword.scss'

function onSubmit(history) {
  return async values => {
    const { email } = trimObject(values)
    try {
      const { status } = await sendResetPasswordEmail(email)
      if (status === 200) {
        history.push({
          pathname: paths.FORGOT_PASSWORD_SENT,
          state: {
            email
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

function validate(values, t) {
  const errors = {}
  if (!values.email) {
    errors.email = t('REQ_EMAIL')
  }
  return errors
}

function ForgotPassword({ history, isLoggedIn = false }) {
  const t = useI18n()
  const { form, handleSubmit, submitting } = useForm({
    onSubmit: onSubmit(history),
    validate: values => validate(values, t)
  })
  const email = useField('email', form)

  if (isLoggedIn) {
    return <Redirect to={paths.ROOT} />
  }

  return (
    <section className="forgot-password section full-min-height is-flex">
      <div className="container mt-50">
        <Logo />
        <div className="container is-spaced has-text-centered mt-40 title is-6">
          <h1>{t('FORGOT_YOUR_PASSWORD')}</h1>
        </div>
        <div className="container is-spaced mt-30 mb-40 has-text-centered subtitle is-6">
          <h2>{t('FORGOT_PASSWORD_TEXT')}</h2>
        </div>
      </div>
      <div className="container is-flex mt-50">
        <form className="control" onSubmit={handleSubmit}>
          <div className="container columns full-height is-flex has-text-centered">
            <div className="column is-hidden-mobile"></div>
            <div className="column mb-50">
              <TextField
                input={email.input}
                meta={email.meta}
                placeholder={t('PLACEHOLDER_EMAIL')}
                type="email"
              />
            </div>
            <div className="column is-spaced has-text-centered">
              <Link className="link" to={{ pathname: paths.LOGIN }}>
                {t('BACK_TO_LOGIN')}
              </Link>
            </div>
            <div className="column">
              <div className="field is-grouped is-grouped-centered">
                <p className="control">
                  <button
                    className="button is-primary"
                    type="submit"
                    disabled={submitting}
                  >
                    {t('BTN_NEXT')}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}

export default ForgotPassword
