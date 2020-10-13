import React from 'react'
import { useSelector } from 'react-redux'
import { path } from 'ramda'
import { useGlobalHideModal } from 'hooks/useGlobalModal'
import { useI18n } from 'shared/i18n'
import { either } from 'shared/utils'
import { Loader } from 'components/Loader'

const DeleteDevicesModal = () => {
  const closeModal = useGlobalHideModal()

  const deleting = useSelector(path(['rma', 'deletingMIs']))
  const hasError = useSelector(path(['rma', 'deletingMIsError']))
  const succeded = !deleting && !hasError

  const t = useI18n()

  return (
    <div className="has-text-centered is-flex flex-column">
      {either(
        deleting,
        <>
          <span className="modal-title mb-15 has-text-white has-text-weight-bold">
            {t('HOLD_ON')}
          </span>
          <span className="has-text-white mb-10">
            {t('RMA_MESSAGE_REMOVING_DEVICES')}
          </span>
          <Loader />
          <span className="has-text-weight-bold mt-10 mb-10">
            {t('DONT_CLOSE_APP')}
          </span>
        </>
      )}

      {either(
        hasError,
        <div className="has-text-centered">
          <span className="has-text-white mb-10">
            {t('RMA_ERROR_REMOVING_DEVICES')}
          </span>
        </div>
      )}

      {either(
        succeded,
        <div className="has-text-centered">
          <span className="has-text-white mb-10">
            {t('RMA_SUCCESS_REMOVING_DEVICES')}
          </span>
        </div>
      )}

      {either(
        !deleting,
        <div className="has-text-centered">
          <button
            className="button is-primary is-uppercase is-center mt-20"
            onClick={closeModal}
          >
            {t('close')}
          </button>
        </div>
      )}
    </div>
  )
}

export default DeleteDevicesModal
