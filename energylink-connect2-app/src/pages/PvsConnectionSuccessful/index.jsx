import React, { useEffect } from 'react'
import { path } from 'ramda'
import { useI18n } from 'shared/i18n'
import './PvsConnectionSuccessful.scss'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import paths from 'routes/paths'
import {
  START_COMMISSIONING_INIT,
  START_DISCOVERY_INIT,
  SET_METADATA_INIT
} from 'state/actions/pvs'

const PvsConnectionSuccessful = ({ animationState }) => {
  const t = useI18n()
  const dispatch = useDispatch()
  const serialNumber = useSelector(state => state.pvs.serialNumber)
  const siteKey = useSelector(path(['site', 'site', 'siteKey']))
  const history = useHistory()

  const goToScanLabels = () => {
    history.push(paths.PROTECTED.SCAN_LABELS.path)
  }

  useEffect(() => {
    if (animationState === 'enter') {
      dispatch(SET_METADATA_INIT(siteKey))
      dispatch(START_COMMISSIONING_INIT())
      dispatch(START_DISCOVERY_INIT())
    }
  }, [dispatch, animationState, siteKey])

  return (
    <div className="tile is-flex is-vertical has-text-centered pvs-connection-success-screen page-height">
      <span className="is-uppercase has-text-weight-bold mb-40">
        {t('CONNECTION_SUCCESS')}
      </span>
      <span className="sp-pvs has-text-white mb-30" />
      <span className="mb-20">{t('CONNECTED_TO')}</span>
      <div className="pvs-sn is-flex has-text-white is-uppercase is-size-6 is-bold is-text has-text-centered">
        <span>{t('PVS_SN_TEXT')}</span>
        <span>{serialNumber}</span>
      </div>
      <span className="mr-40 ml-40 mt-40 is-size-6">
        {t('VERIFY_SERIAL_PVS_CONN_SUCCESS')}
      </span>
      <div className="is-flex auto">
        <button
          className="button is-primary is-uppercase is-center mt-50"
          onClick={goToScanLabels}
        >
          {t('CONTINUE')}
        </button>
      </div>
    </div>
  )
}

export default PvsConnectionSuccessful
