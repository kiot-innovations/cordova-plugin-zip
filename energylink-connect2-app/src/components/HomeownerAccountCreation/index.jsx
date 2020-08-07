import React, { useState } from 'react'
import { useI18n } from 'shared/i18n'
import { isEmpty } from 'ramda'
import SwipeableBottomSheet from 'react-swipeable-bottom-sheet'
import './HomeownerAccountCreation.scss'

const HomeownerAccountCreation = ({ open, onChange, pvs }) => {
  const t = useI18n()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')

  return (
    <SwipeableBottomSheet open={open} onChange={onChange}>
      <div className="homeowner-account-creation has-text-centered">
        <span className="has-text-weight-bold">
          {t('CREATE_HOMEOWNER_ACCOUNT')}
        </span>
        <input
          type="text"
          placeholder={t('FIRST_NAME')}
          onChange={event => setFirstName(event.target.value)}
        />
        <input
          type="text"
          placeholder={t('LAST_NAME')}
          onChange={event => setLastName(event.target.value)}
        />
        <input
          type="text"
          placeholder={t('HOMEOWNER_EMAIL')}
          onChange={event => setEmail(event.target.value)}
        />
        <div className="mb-20">
          <button
            disabled={isEmpty(firstName) || isEmpty(lastName) || isEmpty(email)}
            className="button is-primary is-uppercase"
            onClick={() =>
              window.open(
                `mailto:${email}?subject=${t(
                  'HOMEOWNER_ACCOUNT_EMAIL_SUBJECT'
                )}&body=${encodeURIComponent(
                  t(
                    'HOMEOWNER_ACCOUNT_EMAIL_BODY_TEMPLATE',
                    firstName,
                    lastName,
                    pvs
                  )
                )}`,
                '_system'
              )
            }
          >
            {t('SEND_EMAIL')}
          </button>
        </div>
      </div>
    </SwipeableBottomSheet>
  )
}

export default HomeownerAccountCreation
