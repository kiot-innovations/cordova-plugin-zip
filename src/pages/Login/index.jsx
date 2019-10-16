import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect, Link } from 'react-router-dom'
import { useForm, useField } from 'react-final-form-hooks'
import paths from '../Router/paths'
import Tabs from '../../components/Tabs'
import Logo from '../../components/Logo'
import TextField from '../../components/TextField'
import PasswordToggle from '../../components/PasswordToggle'
import { performLogin } from '../../state/actions/auth'
import { trimObject } from '../../shared/trim'
import { useI18n } from '../../shared/i18n'

import './Login.scss'

function onSubmit(dispatch) {
  return values => dispatch(performLogin(trimObject(values)))
}

function validate(values, t) {
  const errors = {}
  if (!values.username) {
    errors.username = t('REQ_USERNAME')
  }
  if (!values.password) {
    errors.password = t('REQ_PASSWORD')
  }
  return errors
}

function Login({ isLoggedIn = false, location }) {
  const t = useI18n()
  const dispatch = useDispatch()
  const { form, handleSubmit, submitting } = useForm({
    onSubmit: onSubmit(dispatch),
    validate: values => validate(values, t)
  })
  const username = useField('username', form)
  const password = useField('password', form)
  const isPersistent = useField('isPersistent', form)
  const err = useSelector(state => state.user.err)

  if (isLoggedIn) {
    return <Redirect to={paths.ROOT} />
  }

  const loginClassName = `button is-primary${submitting ? ' is-loading' : ''}`

  return (
    <section className="login section full-min-height is-flex">
      <div className="container mt-50">
        <Logo />
      </div>
      <div className="container mt-50">
        <Tabs
          tabs={[
            { title: t('TAB_TITLE_LOGIN'), active: true, url: paths.LOGIN },
            { title: t('TAB_TITLE_SIGNUP'), url: paths.SIGNUP }
          ]}
        />
      </div>
      <div className="container is-flex mt-75">
        <form className="control" onSubmit={handleSubmit}>
          <div className="container columns full-height is-flex has-text-centered">
            <div className="column is-hidden-mobile"></div>
            <div className="column">
              <TextField
                input={username.input}
                meta={username.meta}
                placeholder={t('PLACEHOLDER_EMAIL')}
                type="email"
                autoComplete="email"
              />
              <PasswordToggle
                input={password.input}
                meta={password.meta}
                placeholder={t('PLACEHOLDER_PASSWORD')}
                autoComplete="current-password"
              />
              <div className="field is-dark">
                <p className="control rememeber-me">
                  <label className="checkbox">
                    <input {...isPersistent.input} type="checkbox" />
                    {t('REMEMBER_ME')}
                  </label>
                </p>
              </div>
            </div>
            <div className="column has-text-centered">
              <Link className="link" to={{ pathname: paths.FORGOT_PASSWORD }}>
                {t('FORGOT_PASSWORD')}
              </Link>
              {err && err.status ? (
                <p id="error-message" className="error-message mt-20">
                  {t('WRONG_CREDENTIALS')}
                </p>
              ) : (
                ''
              )}
            </div>
            <div className="column">
              <div className="field is-grouped is-grouped-centered">
                <p className="control">
                  <button
                    className={loginClassName}
                    type="submit"
                    disabled={submitting}
                  >
                    {t('BTN_LOGIN')}
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

export default Login
