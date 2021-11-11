import React from 'react'
import { useHistory } from 'react-router-dom'

import { useGlobalHideModal } from 'hooks/useGlobalModal'
import paths from 'routes/paths'
import { useI18n } from 'shared/i18n'

const ForceStorageFlowModal = () => {
  const t = useI18n()
  const history = useHistory()
  const hideModal = useGlobalHideModal()

  const continueToStorage = () => {
    hideModal()
    history.push(paths.PROTECTED.STORAGE_PREDISCOVERY.path)
  }
  return (
    <div className="has-text-centered is-flex flex-column">
      <div className="mb-10">
        <span className="sp-hey is-size-1" />
      </div>
      <div className="mb-10">
        <span className="has-text-weight-bold">
          {t('STORAGE_FW_OUT_OF_SYNC')}
        </span>
      </div>
      <div className="mb-10">
        <span>{t('STORAGE_FW_OUT_OF_SYNC_BODY')}</span>
      </div>
      <div className="mb-10">
        <button className="button is-primary" onClick={continueToStorage}>
          {t('CONTINUE')}
        </button>
      </div>
    </div>
  )
}

export default ForceStorageFlowModal
