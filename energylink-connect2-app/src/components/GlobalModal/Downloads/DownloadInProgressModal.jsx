import { head, match, pathOr } from 'ramda'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { useI18n } from 'shared/i18n'
import { useGlobalHideModal } from 'hooks/useGlobalModal'
import { MENU_DISPLAY_ITEM, SET_PREVIOUS_URL } from 'state/actions/ui'
import { either } from 'shared/utils'

function DownloadInProgressModal() {
  const dispatch = useDispatch()
  const location = useLocation()
  const hideModal = useGlobalHideModal()
  const t = useI18n()

  const fwName = useSelector(
    pathOr('', ['fileDownloader', 'fileInfo', 'displayName'])
  )
  const fwNameDisplay = head(match(/([0-9]+)$/, fwName))

  return (
    <div className="is-flex flex-column">
      <span className="has-text-white mb-20">
        {t('DOWNLOADING_LATEST_FIRMWARE')}
      </span>

      <span className="has-text-white">
        {either(
          fwNameDisplay,
          t('PVS_FIRMWARE_VERSION', fwNameDisplay),
          t('PVS_FIRMWARE')
        )}
      </span>
      <span className="has-text-white mb-20">{t('STORAGE_FW_FILE')}</span>

      <button
        className="button is-primary is-uppercase"
        onClick={() => {
          dispatch(SET_PREVIOUS_URL(location.pathname))
          dispatch(MENU_DISPLAY_ITEM('MANAGE_FIRMWARES'))
          hideModal()
        }}
      >
        {t('GO_TO_DOWNLOADS')}
      </button>
    </div>
  )
}

export default DownloadInProgressModal
