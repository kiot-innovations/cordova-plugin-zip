import React from 'react'
import clsx from 'clsx'
import { Redirect } from 'react-router-dom'
import { useForm, useField } from 'react-final-form-hooks'
import paths from '../Router/paths'
import Tabs from '../../components/Tabs'
import Logo from '../../components/Logo'
import TextField from '../../components/TextField'
import AsyncTextField from '../../components/AsyncTextField'
import { trimObject } from '../../shared/trim'
import { useI18n } from '../../shared/i18n'
import { EMAIL_REGEXP, PHONE_REGEXP } from '../../shared/regex'
import { checkEmail } from '../../state/actions/auth'
import './Signup.scss'

const validatedEmails = {}

function onSubmit(history, t) {
  async function validateEmail(value) {
    const errors = {}

    if (!value) {
      return t('REQ_EMAIL')
    }

    if (!EMAIL_REGEXP.test(value)) {
      return t('INVALID_EMAIL')
    }

    if (value && !errors.email) {
      try {
        if (!validatedEmails[value]) {
          validatedEmails[value] = await checkEmail(value)
        }
        const { data } = validatedEmails[value]
        if (data && data.code === 'REGCHKEMAIL4002') {
          return t('EMAIL_ALREADY_USE')
        }
      } catch (err) {
        return t('EMAIL_VALIDATION_ERROR')
      }
    }
  }

  function validateName(value) {
    if (!value) {
      return t('REQ_NAME')
    } else if (value.trim().indexOf(' ') === -1) {
      return t('REQ_FULL_NAME')
    }
  }

  function validatePhoneNumber(value) {
    if (!value) {
      return t('REQ_PHONE')
    } else if (!PHONE_REGEXP.test(value)) {
      return t('REQ_VALID_PHONE')
    }
  }

  return async values => {
    const errorEntries = Object.entries({
      name: validateName(values.name),
      email: await validateEmail(values.email),
      phoneNumber: validatePhoneNumber(values.phoneNumber)
    })

    const errors = Object.fromEntries(
      errorEntries.filter(([_, value]) => {
        return !!value
      })
    )

    if (Object.keys(errors).length > 0) {
      return errors
    }
    history.push({
      pathname: paths.SIGNUP_SERIAL,
      state: { signUpState: trimObject(values) }
    })
  }
}

function Signup({ isLoggedIn = false, history }) {
  const t = useI18n()
  const { form, handleSubmit, submitting, validating } = useForm({
    onSubmit: onSubmit(history, t),
    keepDirtyOnReinitialize: true
  })
  const name = useField('name', form)
  const email = useField('email', form)
  const phoneNumber = useField('phoneNumber', form)

  if (isLoggedIn) {
    return <Redirect to={paths.ROOT} />
  }

  const emailHasError =
    (email.meta.touched || email.meta.error === t('INVALID_EMAIL')) &&
    email.meta.error

  const isLoading = submitting || validating

  const classes = clsx('button', 'is-primary', {
    'is-loading': isLoading
  })

  return (
    <section className="signup section full-min-height is-flex">
      <div className="container mt-50">
        <Logo />
      </div>
      <div className="container mt-50">
        <Tabs
          tabs={[
            { title: t('TAB_TITLE_LOGIN'), url: paths.LOGIN },
            { title: t('TAB_TITLE_SIGNUP'), active: true, url: paths.SIGNUP }
          ]}
        />
      </div>
      <div className="container is-flex mt-75">
        <form className="control" onSubmit={handleSubmit}>
          <div className="container columns full-height is-flex has-text-centered">
            <div className="column is-hidden-mobile"></div>
            <div className="column">
              <TextField
                input={name.input}
                meta={name.meta}
                placeholder={t('PLACEHOLDER_NAME')}
              />
              <AsyncTextField
                input={email.input}
                meta={{ ...email.meta, error: emailHasError }}
                placeholder={t('PLACEHOLDER_EMAIL')}
                loading={submitting}
                type="email"
                autoComplete="email"
              />
              <TextField
                input={phoneNumber.input}
                meta={phoneNumber.meta}
                placeholder={t('PLACEHOLDER_PHONE')}
                autoComplete="tel"
              />
            </div>
            <div className="column">
              <div className="field is-grouped is-grouped-centered">
                <p className="control">
                  <button
                    className={classes}
                    type="submit"
                    disabled={isLoading}
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

export default Signup
