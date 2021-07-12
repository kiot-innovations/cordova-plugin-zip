import React from 'react'
import { useDispatch } from 'react-redux'

import { useGlobalHideModal } from 'hooks/useGlobalModal'
import { useI18n } from 'shared/i18n'
import { FIRMWARE_UPDATE_INIT } from 'state/actions/firmwareUpdate'

function FirmwareUpdate(props) {
  const dispatch = useDispatch()
  const hideModal = useGlobalHideModal()
  const t = useI18n()
  const { PVSFromVersion, PVSToVersion } = props
  return (
    <div className="has-text-centered is-flex flex-column">
      <span className="has-text-white mb-20">
        {t('FW_NEW_UPDATE_AVAILABLE')}
      </span>
      <span className="has-text-white">
        {t('FROM_FW_VERSION', PVSFromVersion)}
      </span>
      <span className="has-text-white mb-20">
        {t('TO_FW_VERSION', PVSToVersion)}
      </span>
      <button
        className="button is-primary is-uppercase"
        onClick={() => {
          dispatch(FIRMWARE_UPDATE_INIT(props))
          hideModal()
        }}
      >
        {t('OK')}
      </button>
    </div>
  )
}

export default FirmwareUpdate
