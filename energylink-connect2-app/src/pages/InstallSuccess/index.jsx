import React from 'react'
import { useHistory } from 'react-router-dom'
import useModal from 'hooks/useModal'
import paths from 'routes/paths'
import { useI18n } from 'shared/i18n'
import './InstallSuccess.scss'

const InstallSuccessful = props => {
  const t = useI18n()
  const history = useHistory()

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

  const { modal, toggleModal } = useModal(
    props.animationState,
    modalContent(t),
    modalTitle(t),
    false
  )

  const finishInstall = () => {
    toggleModal()
    history.push(paths.PROTECTED.BILL_OF_MATERIALS.path)
  }

  return (
    <>
      {modal}
      <div className="file level has-text-centered fill-parent install-success-screen auto">
        <div className="is-vertical file level is-vertical is-flex tile">
          <span className="is-uppercase has-text-weight-bold mb-25 mt-25 ">
            {t('INSTALL_SUCCESS')}
          </span>
          <span className="sp-pvs has-text-white mb-30" />
          <span className="mb-20">{t('INSTALL_SUBTITLE')}</span>
          <span className="has-text-white">
            {`${t('YOU_CAN')} `}
            <span className="has-text-weight-bold">{t('TURN_OF_SOLAR')}</span>
          </span>
          <div className="is-flex auto is-vertical tile">
            <button className="button is-primary is-uppercase is-center mt-50">
              {t('CONFIGURE')}
            </button>
            <button
              className="configure-button is-uppercase is-center mt-50 has-text-weight-bold"
              onClick={toggleModal}
            >
              {t('NOT_NOW')}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default InstallSuccessful
