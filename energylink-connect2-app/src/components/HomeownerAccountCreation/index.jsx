import React from 'react'
import { useI18n } from 'shared/i18n'
import SwipeableBottomSheet from 'react-swipeable-bottom-sheet'
import './HomeownerAccountCreation.scss'

const HomeownerAccountCreation = ({ open, onChange }) => {
  const t = useI18n()

  return (
    <SwipeableBottomSheet open={open} onChange={onChange}>
      <div className="homeowner-account-creation has-text-centered">
        <span className="has-text-weight-bold">
          {t('CREATE_HOMEOWNER_ACCOUNT')}
        </span>
        <input type="text" placeholder={t('FIRST_NAME')} onChange={() => {}} />
        <input type="text" placeholder={t('LAST_NAME')} onChange={() => {}} />
        <input
          type="text"
          placeholder={t('HOMEOWNER_EMAIL')}
          onChange={() => {}}
        />
        <div className="mb-20">
          <button
            className="button is-primary is-uppercase"
            onClick={() =>
              window.open(
                `mailto:pepe@example.com?subject=${t(
                  'HOMEOWNER_ACCOUNT_EMAIL_SUBJECT'
                )}&body=${encodeURIComponent(
                  t('HOMEOWNER_ACCOUNT_EMAIL_BODY_TEMPLATE')
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
