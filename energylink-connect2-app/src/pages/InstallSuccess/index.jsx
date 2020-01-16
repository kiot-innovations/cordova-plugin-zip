import React from 'react'
import './InstallSuccess.scss'
import { useI18n } from 'shared/i18n'
const InstallSuccessful = props => {
  const t = useI18n()
  return (
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
          <button className="configure-button is-uppercase is-center mt-50 has-text-weight-bold">
            {t('NOT_NOW')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default InstallSuccessful
