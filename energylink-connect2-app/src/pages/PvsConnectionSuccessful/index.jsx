import React from 'react'
import { useI18n } from 'shared/i18n'
import './PvsConnectionSuccessful.scss'
import { useSelector } from 'react-redux'

const PvsConnectionSuccessful = () => {
  const t = useI18n()
  const serialNumber = useSelector(state => state.pvs.serialNumber)

  return (
    <div className="tile is-flex is-vertical has-text-centered pvs-connection-success-screen page-height">
      <span className="is-uppercase has-text-weight-bold mb-40">
        {t('CONNECTION_SUCCESS')}
      </span>
      <span className="sp-pvs has-text-white mb-30" />
      <span className="mb-20">{t('CONNECTED_TO')}</span>
      <div className="tile is-vertical is-flex has-text-white is-uppercase is-size-7 is-bold is-text">
        <span>{t('PVS_SN_TEXT')}</span>
        <span>{serialNumber}</span>
      </div>
      <span className="mr-40 ml-40 mt-40 is-size-6">
        {t('VERIFY_SERIAL_PVS_CONN_SUCCESS')}
      </span>
      <div className="is-flex auto">
        <button className="button is-primary is-uppercase is-center mt-50">
          {t('CONTINUE')}
        </button>
      </div>
    </div>
  )
}

export default PvsConnectionSuccessful
