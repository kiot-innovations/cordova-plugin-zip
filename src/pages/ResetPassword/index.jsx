import React, { useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useForm, useField } from 'react-final-form-hooks'
import { resetPassword, validatePackage } from '../../state/actions/auth'
import paths from '../Router/paths'
import TextField from '../../components/TextField'
import PasswordToggle from '../../components/PasswordToggle'
import { useI18n } from '../../shared/i18n'
import { PASSWORD_REGEXP } from '../../shared/regex'
import keyIcon from './Icons/key-icon.png'
import './ResetPassword.scss'

async function triggerPackageValidation(pkg, history) {
  try {
    const { status } = await validatePackage(pkg)
    if (status !== 200) {
      history.push({
        pathname: paths.FORGOT_PASSWORD
      })
    }
    return
  } catch (err) {
    history.push({
      pathname: paths.ROOT
    })
  }
}

function onSubmit(pkg, dispatch) {
  return async values => dispatch(resetPassword(values, pkg))
}

function validate(values, t) {
  const errors = {}

  if (!values.email) {
    errors.email = t('REQ_EMAIL')
  }
  if (!values.password) {
    errors.password = t('REQ_PASSWORD')
  }
  if (!values.retypePassword) {
    errors.retypePassword = t('REQ_PASSWORD')
  }
  if (values.password && !PASSWORD_REGEXP.test(values.password)) {
    errors.password = t('INVALID_PASSWORD')
  }
  if (values.password !== values.retypePassword) {
    errors.retypePassword = t('INVALID_PASSWORD_MATCH')
  }
  return errors
}

function ResetPassword({ match = {}, isLoggedIn = false, history = {} }) {
  const t = useI18n()
  const dispatch = useDispatch()
  const { pkg } = match.params

  useEffect(() => {
    triggerPackageValidation(pkg, history)
  }, [pkg, history])

  const { form, handleSubmit, submitting } = useForm({
    onSubmit: onSubmit(pkg, dispatch),
    validate: values => validate(values, t)
  })
  const email = useField('email', form)
  const password = useField('password', form)
  const retypePassword = useField('retypePassword', form)
  const termsAgree = useField('termsAgree', form)

  if (isLoggedIn || !pkg) {
    return <Redirect to={paths.ROOT} />
  }

  return (
    <section className="signup-password section has-bar full-min-height is-flex">
      <div className="container is-spaced mt-0 has-text-centered subtitle is-6">
        <img className="mb-25" src={keyIcon} alt="Welcome" />
        <h2>{t('WELCOME_BACK')}</h2>
      </div>
      <div className="container is-spaced mt-0 dots title is-5">
        <h2>---</h2>
      </div>
      <div className="container is-spaced mt-0 title is-6">
        <h1>{t('CREATE_NEW_PASSWORD')}</h1>
      </div>
      <div className="container is-flex mt-35">
        <form className="control" onSubmit={handleSubmit}>
          <div className="container columns full-height is-flex has-text-centered">
            <div className="column is-hidden-mobile"></div>
            <div className="column">
              <TextField
                input={email.input}
                meta={email.meta}
                placeholder={t('PLACEHOLDER_CONFIRM_EMAIL')}
                type="email"
                autoComplete="email"
              />
              <PasswordToggle
                input={password.input}
                meta={password.meta}
                placeholder={t('PLACEHOLDER_PASSWORD1')}
                autoComplete="off"
              />
              <PasswordToggle
                input={retypePassword.input}
                meta={retypePassword.meta}
                placeholder={t('PLACEHOLDER_PASSWORD2')}
                autoComplete="off"
              />
            </div>
            <div className="column info ml-15">
              <div className="mb-10">{t('PASSWORD_REQ')}</div>
              <ul>
                <li>{t('PASSWORD_REQ_ONE_LOWER')}</li>
                <li>{t('PASSWORD_REQ_EIGHT_OR_MORE')}</li>
                <li>{t('PASSWORD_REQ_AT_LEAST_TWO_LETTERS')}</li>
                <li>{t('PASSWORD_REQ_AT_LEAST_ONE_NUMBER')}</li>
              </ul>
            </div>
            <div className="column">
              <div className="field is-dark">
                <p className="control terms-agreement">
                  <label className="checkbox">
                    <input {...termsAgree.input} type="checkbox" />
                    {t('TERMS_AGREEMENT')}
                  </label>
                </p>
              </div>
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

export default ResetPassword
