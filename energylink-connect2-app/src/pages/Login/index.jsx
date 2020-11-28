import React, { useEffect } from 'react'
import clsx from 'clsx'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import Logo from '@sunpower/sunpowerimage'

import { requestLogin, handleLoginFromPing } from 'state/actions/auth'
import { CHECK_SSL_CERTS } from 'state/actions/global'
import { useI18n } from 'shared/i18n'
import paths from 'routes/paths'

import './Login.scss'
import { either } from 'shared/utils'

function Login() {
  const t = useI18n()
  const dispatch = useDispatch()

  const isAuthenticating = useSelector((state) => state.user.isAuthenticating)
  const error = useSelector((state) => state.user.err)

  const loginClassName = clsx('button', 'is-primary', 'is-uppercase', {
    'is-loading': isAuthenticating
  })

  useEffect(() => {
    dispatch(CHECK_SSL_CERTS())
  }, [dispatch])

  useEffect(() => {
    window.handleOpenURL = handleOpenURL(dispatch)
  }, [dispatch])

  return (
    <section className="login section full-height is-flex">
      <div className="container has-text-centered pb-20">
        <Logo />
        <h1 className="is-uppercase has-text-white heading">{t('APP_NAME')}</h1>
      </div>

      <div className="auto">
        <div className="mb-30 has-text-centered">
          <p>{t('NO_ACCOUNT')}</p>
          <Link
            className="has-text-weight-bold is-uppercase is-size-7"
            to={paths.UNPROTECTED.GET_ASSISTANCE.path}
          >
            {t('GET_ASSISTANCE')}
          </Link>
        </div>

        <div className="mt-10">
          <div className="field is-grouped is-grouped-centered">
            <p className="control">
              <button
                type="button"
                className={loginClassName}
                disabled={!!isAuthenticating}
                onClick={onSubmit(dispatch)}
              >
                {isAuthenticating ? t('BTN_LOGGING_IN') : t('BTN_LOG_IN')}
              </button>
            </p>
          </div>

          {either(
            isAuthenticating,
            <p>
              <button
                className="button has-text-primary is-text is-uppercase is-size-6 mt-20"
                onClick={onSubmit(dispatch)}
              >
                {t('LOGIN_TRY_AGAIN')}
              </button>
            </p>
          )}
        </div>

        {error && error.message ? (
          <div className="message error mb-10 mt-10">
            <p className="pl-20 pr-20">{t(error.message)}</p>
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default Login

const onSubmit = dispatch => () => {
  dispatch(requestLogin())
}

const handleOpenURL = dispatch => URL => {
  setTimeout(() => {
    dispatch(handleLoginFromPing(URL))
  }, 0)
}
