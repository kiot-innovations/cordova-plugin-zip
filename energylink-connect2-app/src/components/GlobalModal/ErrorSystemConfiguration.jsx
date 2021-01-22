import React from 'react'
import { useGlobalHideModal } from 'hooks/useGlobalModal'
import { useI18n } from 'shared/i18n'

const ErrorSystemConfigurationModal = ({ forceSubmit }) => {
  const closeModal = useGlobalHideModal()
  const t = useI18n()

  return (
    <div className="has-text-centered is-flex flex-column">
      <span className="has-text-white mb-10">{t('ERROR_CONFIGURATION_1')}</span>
      <span className="has-text-white mb-10">{t('ERROR_CONFIGURATION_2')}</span>

      <div className="inline-buttons">
        <button
          className="button half-button-padding is-primary is-outlined is-uppercase mr-10"
          onClick={closeModal}
        >
          {t('CANCEL')}
        </button>
        <button
          className="button half-button-padding is-primary is-uppercase ml-10"
          onClick={() => {
            forceSubmit()
            closeModal()
          }}
        >
          {t('CONTINUE')}
        </button>
      </div>
    </div>
  )
}

export default ErrorSystemConfigurationModal
