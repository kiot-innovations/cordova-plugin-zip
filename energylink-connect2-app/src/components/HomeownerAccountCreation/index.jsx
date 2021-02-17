import React from 'react'
import { useField, useForm } from 'react-final-form-hooks'
import SwipeableBottomSheet from 'react-swipeable-bottom-sheet'
import { evolve, isEmpty, pathOr } from 'ramda'
import { CREATE_HOMEOWNER_ACCOUNT } from 'state/actions/site'
import { useDispatch, useSelector } from 'react-redux'
import TextField from '@sunpower/textfield'

import { Loader } from 'components/Loader'
import { useI18n } from 'shared/i18n'
import { cleanString, either } from 'shared/utils'

import './HomeownerAccountCreation.scss'

const sanitizeInputs = evolve({
  firstName: cleanString,
  lastName: cleanString
})

const HomeownerAccountCreation = ({ open, onChange }) => {
  const t = useI18n()
  const dispatch = useDispatch()
  const onSubmit = homeownerData => {
    const homeownerSanitizedData = sanitizeInputs(homeownerData)
    return dispatch(CREATE_HOMEOWNER_ACCOUNT(homeownerSanitizedData))
  }

  const { form, handleSubmit } = useForm({
    onSubmit,
    initialValues: {
      firstName: '',
      lastName: '',
      email: ''
    },
    validate: ({ firstName, lastName, email }) => {
      const errors = {}

      if (isEmpty(firstName.trim())) {
        errors.firstName = 'Required'
      }

      if (isEmpty(lastName.trim())) {
        errors.lastName = 'Required'
      }

      if (isEmpty(email.trim())) {
        errors.email = 'Required'
      }

      return errors
    }
  })
  const { complete, creating, error } = useSelector(
    pathOr({}, ['site', 'homeownerCreation'])
  )
  const firstName = useField('firstName', form)
  const lastName = useField('lastName', form)
  const email = useField('email', form)
  const submitDisabled =
    isEmpty(firstName.input.value.trim()) ||
    isEmpty(lastName.input.value.trim()) ||
    isEmpty(email.input.value.trim())

  return (
    <SwipeableBottomSheet open={open} onChange={onChange}>
      <div className="homeowner-account-creation has-text-centered">
        <span className="has-text-weight-bold">
          {t('CREATE_HOMEOWNER_ACCOUNT')}
        </span>
        {either(
          creating,
          <>
            <Loader />
            <span>{t('CREATE_HOMEOWNER_ACCOUNT_CREATING')}</span>
          </>
        )}
        {either(
          complete,
          <div>
            <span className="sp-check is-block is-size-4 has-text-white mb-10 mt-10" />
            <span className="is-block mb-10">
              {t('CREATE_HOMEOWNER_ACCOUNT_COMPLETE')}
            </span>
            <button
              className="button is-primary is-uppercase"
              onClick={onChange}
            >
              {t('OK')}
            </button>
          </div>
        )}
        {either(
          error,
          <span className="has-text-white is-block">
            {t('CREATE_HOMEOWNER_ACCOUNT_ERROR')}
          </span>
        )}
        {either(
          !creating && !complete,
          <form onSubmit={handleSubmit}>
            <TextField
              className="mt-20"
              input={firstName.input}
              meta={firstName.meta}
              type="text"
              placeholder={t('FIRST_NAME')}
            />
            <TextField
              input={lastName.input}
              meta={lastName.meta}
              type="text"
              placeholder={t('LAST_NAME')}
            />
            <TextField
              input={email.input}
              meta={email.meta}
              type="email"
              placeholder={t('HOMEOWNER_EMAIL')}
            />
            <div className="mt-20">
              <button
                disabled={submitDisabled}
                className="button is-primary is-uppercase"
                type="submit"
              >
                {t('SEND_EMAIL')}
              </button>
            </div>
          </form>
        )}
      </div>
    </SwipeableBottomSheet>
  )
}

export default HomeownerAccountCreation
