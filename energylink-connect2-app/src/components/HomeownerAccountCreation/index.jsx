import React from 'react'
import { useField, useForm } from 'react-final-form-hooks'
import SwipeableBottomSheet from 'react-swipeable-bottom-sheet'
import { evolve, isEmpty } from 'ramda'
import TextField from '@sunpower/textfield'

import { useI18n } from 'shared/i18n'
import { createExternalLinkHandler } from 'shared/routing'
import { cleanString } from 'shared/utils'

import './HomeownerAccountCreation.scss'

const sanitizeInputs = evolve({
  firstName: cleanString,
  lastName: cleanString,
  email: cleanString
})
const HomeownerAccountCreation = ({ open, onChange, pvs }) => {
  const t = useI18n()
  const onSubmit = homeOwnerData => {
    const { firstName, lastName, email } = sanitizeInputs(homeOwnerData)
    return createExternalLinkHandler(
      `mailto:${email.trim()}?subject=${t(
        'HOMEOWNER_ACCOUNT_EMAIL_SUBJECT'
      )}&body=${encodeURIComponent(
        t(
          'HOMEOWNER_ACCOUNT_EMAIL_BODY_TEMPLATE',
          firstName.trim(),
          lastName.trim(),
          pvs
        )
      )}`
    )()
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
          <div className="mt-20 mb-20">
            <button
              disabled={submitDisabled}
              className="button is-primary is-uppercase"
              type="submit"
            >
              {t('SEND_EMAIL')}
            </button>
          </div>
        </form>
      </div>
    </SwipeableBottomSheet>
  )
}

export default HomeownerAccountCreation
