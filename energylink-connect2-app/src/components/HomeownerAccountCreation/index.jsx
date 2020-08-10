import React from 'react'
import { useField, useForm } from 'react-final-form-hooks'
import SwipeableBottomSheet from 'react-swipeable-bottom-sheet'
import { isEmpty } from 'ramda'
import TextField from '@sunpower/textfield'
import { useI18n } from 'shared/i18n'
import { createExternalLinkHandler } from 'shared/routing'
import './HomeownerAccountCreation.scss'

const HomeownerAccountCreation = ({ open, onChange, pvs }) => {
  const t = useI18n()
  const onSubmit = ({ firstName, lastName, email }) =>
    createExternalLinkHandler(
      `mailto:${email}?subject=${t(
        'HOMEOWNER_ACCOUNT_EMAIL_SUBJECT'
      )}&body=${encodeURIComponent(
        t('HOMEOWNER_ACCOUNT_EMAIL_BODY_TEMPLATE', firstName, lastName, pvs)
      )}`
    )()
  const { form, handleSubmit } = useForm({
    onSubmit
  })
  const firstName = useField('firstName', form)
  const lastName = useField('lastName', form)
  const email = useField('email', form)
  const submitDisabled =
    isEmpty(firstName.input.value) ||
    isEmpty(lastName.input.value) ||
    isEmpty(email.input.value)

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
