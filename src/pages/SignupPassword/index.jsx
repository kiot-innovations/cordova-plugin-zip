import React from 'react'
import { Redirect } from 'react-router-dom'
import { useForm, useField } from 'react-final-form-hooks'
import { trimObject } from '../../shared/trim'
import paths from '../Router/paths'
import BackButtonBar from '../../components/BackButtonBar'
import PasswordToggle from '../../components/PasswordToggle'
import { useI18n } from '../../shared/i18n'
import { PASSWORD_REGEXP } from '../../shared/regex'
import keyIcon from './Icons/key-icon.png'
import './SignupPassword.scss'

function onSubmit(history, signUpState) {
  return values =>
    history.push({
      pathname: paths.SIGNUP_LOADER,
      state: { signUpState: { ...signUpState, ...trimObject(values) } }
    })
}

function validate(values, t) {
  const errors = {}

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

  if (!values.termsAgree) {
    errors.termsAgree = t('MUST_ACCEPT_AGREEMENTS')
  }

  return errors
}

function SignupPassword({ history, location = {}, isLoggedIn = false }) {
  const t = useI18n()
  const signUpState =
    location.state &&
    location.state.signUpState &&
    location.state.signUpState.serial

  const { form, handleSubmit, submitting } = useForm({
    onSubmit: onSubmit(history, location.state.signUpState),
    validate: values => validate(values, t)
  })
  const password = useField('password', form)
  const retypePassword = useField('retypePassword', form)
  const termsAgree = useField('termsAgree', form)

  if (isLoggedIn || !signUpState) {
    return <Redirect to={paths.ROOT} />
  }

  return (
    <section className="signup-password section has-bar full-min-height is-flex">
      <BackButtonBar history={history} to={paths.SIGNUP_SERIAL} />
      <div className="container is-spaced mt-0 has-text-centered subtitle is-6">
        <img className="mb-25" src={keyIcon} alt="Welcome" />
        <h2>{t('LAST_STEP')}</h2>
      </div>
      <div className="container is-spaced mt-0 dots title is-5">
        <h2>---</h2>
      </div>
      <div className="container is-spaced mt-0 title is-6">
        <h1>{t('CREATE_PASSWORD')}</h1>
      </div>
      <div className="container is-flex mt-35">
        <form className="control" onSubmit={handleSubmit}>
          <div className="container columns full-height is-flex has-text-centered">
            <div className="column is-hidden-mobile"></div>
            <div className="column">
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
                <div className="control terms-agreement">
                  <label className="checkbox">
                    <input {...termsAgree.input} type="checkbox" />
                    {t('TERMS_AGREEMENT')}
                  </label>
                  <br />
                  {termsAgree.meta.touched && termsAgree.meta.error && (
                    <span className="error">{termsAgree.meta.error}</span>
                  )}
                </div>
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
                    {t('BTN_CREATE_ACCOUNT')}
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

export default SignupPassword
