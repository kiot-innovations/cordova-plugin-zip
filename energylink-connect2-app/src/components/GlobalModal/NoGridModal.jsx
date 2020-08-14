import React from 'react'
import { useI18n } from 'shared/i18n'
import { useGlobalHideModal } from 'hooks/useGlobalModal'

const NoGridSelectedModal = () => {
  const t = useI18n()
  const closeModal = useGlobalHideModal()

  return (
    <div className="has-text-centered is-flex flex-column">
      <span className="has-text-white mb-10">{t('SET_GRID_VOLTAGE')}</span>
      <div className="inline-buttons">
        <button
          className="button half-button-padding is-primary is-outlined is-uppercase mr-10"
          onClick={closeModal}
        >
          {t('CONTINUE')}
        </button>
      </div>
    </div>
  )
}
export default NoGridSelectedModal
