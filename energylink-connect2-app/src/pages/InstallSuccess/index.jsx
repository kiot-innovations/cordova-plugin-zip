import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { ALLOW_COMMISSIONING } from 'state/actions/systemConfiguration'
import { STOP_NETWORK_POLLING } from 'state/actions/network'
import useModal from 'hooks/useModal'
import paths from 'routes/paths'
import { useI18n } from 'shared/i18n'
import './InstallSuccess.scss'

const InstallSuccessful = () => {
  const t = useI18n()
  const history = useHistory()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(ALLOW_COMMISSIONING())
  }, [dispatch])

  const finishInstall = () => {
    dispatch(STOP_NETWORK_POLLING())
    history.push(paths.PROTECTED.BILL_OF_MATERIALS.path)
    toggleModal()
  }

  const modalContent = t => (
    <div className="has-text-centered">
      <span className="has-text-white">{t('TURN_OFF_BREAKERS')}</span>
      <div>
        <button
          onClick={finishInstall}
          className="button is-primary is-uppercase is-center mt-20"
        >
          {t('CONTINUE')}
        </button>
      </div>
    </div>
  )

  const modalTitle = t => (
    <span className="has-text-white has-text-weight-bold">
      {t('ATTENTION')}
    </span>
  )

  const { modal, toggleModal } = useModal(modalContent(t), modalTitle(t), false)

  const goToConfigure = () => {
    history.push(paths.PROTECTED.SYSTEM_CONFIGURATION.path)
  }

  return (
    <>
      {modal}
      <div className="fill-parent install-success-screen">
        <span className="is-uppercase has-text-weight-bold">
          {t('INSTALL_SUCCESS')}
        </span>
        <span className="sp-pvs has-text-white " />
        <span>{t('INSTALL_SUBTITLE')}</span>
        <button
          onClick={goToConfigure}
          className="button is-primary is-uppercase is-center"
        >
          {t('CONFIGURE')}
        </button>
        <button
          className="configure-button has-text-primary is-uppercase is-center has-text-weight-bold mb-20"
          onClick={toggleModal}
        >
          {t('NOT_NOW')}
        </button>
      </div>
    </>
  )
}

export default InstallSuccessful
