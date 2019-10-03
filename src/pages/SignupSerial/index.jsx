import React from 'react'
import clsx from 'clsx'
import { Redirect, Link } from 'react-router-dom'
import { useForm, useField } from 'react-final-form-hooks'
import paths from '../Router/paths'
import BackButtonBar from '../../components/BackButtonBar'
import serialIcon from './Icons/serial-icon.png'
import { trimObject } from '../../shared/trim'
import { useI18n } from '../../shared/i18n'
import { validateSerial } from '../../state/actions/auth'
import AsyncTextField from '../../components/AsyncTextField'

import './SignupSerial.scss'

let addressId

function onSubmit(history, signUpState, t) {
  async function checkSerial(values) {
    const errors = {}
    addressId = null
    if (!values.serial) {
      errors.serial = t('REQ_SERIAL')
      return errors
    }

    let isValid = false
    try {
      const { status, data } = await validateSerial(values.serial)
      isValid = status === 200
      if (isValid) {
        addressId = data.AddressID
      }
    } catch (err) {
      errors.serial = t('SERIAL_VALIDATION_ERROR')
      return errors
    }
    if (!isValid || values.serial.length < 4) {
      errors.serial = t('SERIAL_INVALID')
    }
    return errors
  }

  return async values => {
    const errors = await checkSerial(values)
    if (Object.keys(errors).length > 0) {
      return errors
    }

    history.push({
      pathname: paths.SIGNUP_PASSWORD,
      state: {
        signUpState: { ...signUpState, ...trimObject(values), addressId }
      }
    })
  }
}

function SignupSerial({ history, location = {}, isLoggedIn = false }) {
  const t = useI18n()
  const signUpState = location.state && location.state.signUpState
  const { form, handleSubmit, submitting, validating } = useForm({
    onSubmit: onSubmit(history, signUpState, t)
  })
  const serial = useField('serial', form)

  if (isLoggedIn || !signUpState) {
    return <Redirect to={paths.ROOT} />
  }

  // TODO: this shouldn't be necessary, serial.meta.touched && serial.meta.error should be enough
  // We want to show an error while typing for async serial validation
  const hasError =
    (serial.meta.touched || serial.meta.submitError === t('SERIAL_INVALID')) &&
    serial.meta.submitError

  const isLoading = submitting || validating

  const classes = clsx('button', 'is-primary', { 'is-loading': isLoading })

  return (
    <section className="signup-serial section has-bar full-min-height is-flex">
      <BackButtonBar history={history} to={paths.SIGNUP} />
      <div className="container is-spaced mt-0 has-text-centered subtitle is-6">
        <img className="mb-25" src={serialIcon} alt="Welcome" />
        <h2>
          {t('WELCOME')} {signUpState.name}.
        </h2>
      </div>
      <div className="container is-spaced mt-0 dots title is-5">
        <h2>---</h2>
      </div>
      <div className="container is-spaced mt-0 has-text-centered title is-6">
        <h1>{t('MATCH_SERIAL')}</h1>
      </div>
      <div className="container is-spaced mt-20 has-text-centered">
        <Link
          className="link"
          to={{ pathname: paths.HELP_SERIAL, state: location.state }}
        >
          {t('SERIAL_HELP')}
        </Link>
      </div>
      <div className="container is-flex mt-35">
        <form className="control" onSubmit={handleSubmit}>
          <div className="container columns full-height is-flex has-text-centered">
            <div className="column is-hidden-mobile"></div>
            <div className="column">
              <AsyncTextField
                input={serial.input}
                meta={{ ...serial.meta, error: hasError }}
                placeholder={t('PLACEHOLDER_SERIAL')}
                loading={submitting}
                type="text"
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

export default SignupSerial
