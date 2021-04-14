import React from 'react'
import { useDispatch } from 'react-redux'
import { useI18n } from 'shared/i18n'
import { useGlobalHideModal } from 'hooks/useGlobalModal'
import { MENU_DISPLAY_ITEM } from 'state/actions/ui'

function DownloadFailedModal() {
  const dispatch = useDispatch()

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
