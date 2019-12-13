import React, { useEffect } from 'react'
import clsx from 'clsx'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import Logo from '@sunpower/sunpowerimage'

import { requestLogin, handleLoginFromPing } from 'state/actions/auth'
import { useI18n } from 'shared/i18n'
import paths from 'routes/paths'

import './Login.scss'

function Login() {
  const t = useI18n()
  const dispatch = useDispatch()

  const auth = useSelector(state => state.user.auth)
  const submitting = useSelector(state => state.user.submitting)

  const loginClassName = clsx('button', 'is-primary', {
    'is-loading': submitting
  })

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
          <Link className="link" to={paths.UNPROTECTED.GET_ASSISTANCE.path}>
            {t('GET_ASSISTANCE')}
          </Link>
        </div>

        <div className="mt-10">
          <div className="field is-grouped is-grouped-centered">
            <p className="control">
              <button
                type="button"
                className={loginClassName}
                disabled={!!submitting}
                onClick={onSubmit(dispatch)}
              >
                {!auth.access_token ? t('BTN_LOGIN') : t('BTN_LOGOUT')}
              </button>
            </p>
          </div>
        </div>
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
