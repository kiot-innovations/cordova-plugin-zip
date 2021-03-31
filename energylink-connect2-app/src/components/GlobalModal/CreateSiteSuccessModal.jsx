import React from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import paths from 'routes/paths'
import { useI18n } from 'shared/i18n'
import { useGlobalHideModal } from 'hooks/useGlobalModal'
import { CREATE_SITE_RESET } from 'state/actions/site'

export const CreateSiteSuccessModal = () => {
  const t = useI18n()
  const closeModal = useGlobalHideModal()
  const dispatch = useDispatch()
  const history = useHistory()

  const onContinue = () => {
    history.push(paths.PROTECTED.ROOT.path)
    dispatch(CREATE_SITE_RESET())
    closeModal()
  }

  return (
    <div className="has-text-centered">
      <span className="has-text-primary">{t('SITE_CREATED_MODAL_BODY')}</span>
      <div>
        <button
          onClick={onContinue}
          className="button is-primary is-uppercase is-center mt-20"
        >
          {t('CONTINUE')}
        </button>
      </div>
    </div>
  )
}

export default CreateSiteSuccessModal
