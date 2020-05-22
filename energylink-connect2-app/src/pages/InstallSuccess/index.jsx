import React from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { STOP_NETWORK_POLLING } from 'state/actions/network'
import useModal from 'hooks/useModal'
import paths from 'routes/paths'
import { useI18n } from 'shared/i18n'
import './InstallSuccess.scss'

const InstallSuccessful = () => {
  const t = useI18n()
  const history = useHistory()
  const dispatch = useDispatch()

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

  const goToPanelLayoutTool = () => {
    history.push(paths.PROTECTED.PANEL_LAYOUT_TOOL.path)
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
        <span className="has-text-white">
          {t('YOU_CAN')}&nbsp;
          <span className="has-text-weight-bold">{t('TURN_OFF_SOLAR')}</span>
        </span>
        <button
          onClick={goToConfigure}
          className="button is-primary is-uppercase is-center"
        >
          {t('CONFIGURE')}
        </button>
        <button
          className="configure-button has-text-primary is-uppercase is-center has-text-weight-bold"
          onClick={toggleModal}
        >
          {t('NOT_NOW')}
        </button>
        <button
          className="configure-button has-text-primary is-uppercase is-center has-text-weight-bold"
          onClick={goToPanelLayoutTool}
        >
          {t('GO_PANEL_LAYOUT')}
        </button>
      </div>
    </>
  )
}

export default InstallSuccessful
