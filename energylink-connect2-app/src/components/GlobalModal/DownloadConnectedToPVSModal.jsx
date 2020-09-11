import React from 'react'
import { useDispatch } from 'react-redux'
import { useI18n } from 'shared/i18n'
import { useGlobalHideModal } from 'hooks/useGlobalModal'
import { DOWNLOAD_ALLOW_WITH_PVS } from 'state/actions/fileDownloader'

export const DownloadConnectedToPVSModal = () => {
  const t = useI18n()
  const closeModal = useGlobalHideModal()
  const dispatch = useDispatch()

  const handleContinue = () => {
    dispatch(DOWNLOAD_ALLOW_WITH_PVS())
    closeModal()
  }

  return (
    <div className="has-text-centered">
      <span className="has-text-white">{t('DOWNLOAD_CONNECTED_TO_PVS')}</span>
      <div>
        <button
          onClick={handleContinue}
          className="button is-primary is-uppercase is-center mt-20"
        >
          {t('CONTINUE')}
        </button>
      </div>
    </div>
  )
}

export default DownloadConnectedToPVSModal
