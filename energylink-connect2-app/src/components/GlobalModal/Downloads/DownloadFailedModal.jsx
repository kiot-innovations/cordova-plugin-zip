import React from 'react'
import { useDispatch } from 'react-redux'
import { useI18n } from 'shared/i18n'
import { useGlobalHideModal } from 'hooks/useGlobalModal'
import { useLocation } from 'react-router-dom'
import { MENU_DISPLAY_ITEM, SET_PREVIOUS_URL } from 'state/actions/ui'

function DownloadFailedModal() {
  const dispatch = useDispatch()
  const location = useLocation()

  const hideModal = useGlobalHideModal()
  const t = useI18n()

  return (
    <div className="has-text-centered is-flex flex-column">
      <span className="has-text-white mb-20">
        {t('DOWNLOADING_FIRMWARE_FAILED')}
      </span>
      <button
        className="button is-primary is-uppercase"
        onClick={() => {
          dispatch(SET_PREVIOUS_URL(location.pathname))
          dispatch(MENU_DISPLAY_ITEM('MANAGE_FIRMWARES'))
          hideModal()
        }}
      >
        {t('TRY_AGAIN')}
      </button>
    </div>
  )
}

export default DownloadFailedModal
