import React from 'react'
import clsx from 'clsx'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect, Link } from 'react-router-dom'
import { useForm, useField } from 'react-final-form-hooks'

import Logo from '@sunpower/sunpowerimage'
import TextField from '@sunpower/textfield'
import PasswordToggle from '../../components/PasswordToggle'

import { performLogin } from '../../state/actions/auth'
import { trimObject } from '../../shared/trim'
import { useI18n } from '../../shared/i18n'
import paths from '../Router/paths'

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

  const loginClassName = clsx('button', 'is-primary', {
    'is-loading': submitting
  })

  const ROUTES = {
    FORGOT: { pathname: paths.FORGOT_PASSWORD },
    ASSISTANCE: { pathname: paths.GET_ASSISTANCE }
  }

  return (
    <section className="login section full-min-height is-flex level">
      <div className="container">
        <Logo />
        <h1 className="is-uppercase has-text-white heading">
          EnergyLink Connect
        </h1>
      </div>

      <form className="control" onSubmit={handleSubmit}>
        <div className="container full-height has-text-centered pb-20">
          <div>
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

          <div className="has-text-centered forgot">
            <Link className="link" to={ROUTES.FORGOT}>
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

          <div>
            <div className="mb-30">
              <p>{t('NO_ACCOUNT')}</p>
              <Link className="link" to={ROUTES.ASSISTANCE}>
                {t('GET_ASSISTANCE')}
              </Link>
            </div>

            <div className="mt-10">
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
        </div>
      </form>
    </section>
  )
}

export default Login
