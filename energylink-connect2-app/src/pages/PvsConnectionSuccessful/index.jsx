import React, { useEffect } from 'react'
import { pathOr } from 'ramda'
import { useI18n } from 'shared/i18n'
import './PvsConnectionSuccessful.scss'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import paths from 'routes/paths'
import { either } from 'shared/utils'
import {
  START_COMMISSIONING_INIT,
  START_DISCOVERY_INIT
} from 'state/actions/pvs'

const getPVSVersionChecked = pathOr(false, ['firmwareUpdate', 'canContinue'])

const PvsConnectionSuccessful = ({ animationState }) => {
  const t = useI18n()
  const dispatch = useDispatch()
  const serialNumber = useSelector(state => state.pvs.serialNumber)
  const versionChecked = useSelector(getPVSVersionChecked)
  const history = useHistory()

  const goToScanLabels = () => {
    history.push(paths.PROTECTED.SCAN_LABELS.path)
  }

  useEffect(() => {
    if (animationState === 'enter') {
      dispatch(START_COMMISSIONING_INIT())
      dispatch(START_DISCOVERY_INIT())
    }
  }, [dispatch, animationState])

  return (
    <div className="pvs-connection-success-screen pr-20 pl-20">
      <span className="is-uppercase has-text-weight-bold">
        {t('CONNECTION_SUCCESS')}
      </span>
      <span className="sp-pvs has-text-white" />
      <span>{t('CONNECTED_TO')}</span>
      <div className="pvs-sn is-flex has-text-white is-uppercase is-size-6 is-bold is-text has-text-centered">
        <span>{t('PVS_SN_TEXT')}</span>
        <span>{serialNumber}</span>
      </div>
      <span className="mr-10 ml-10 is-size-6 has-text-centered">
        {t('VERIFY_SERIAL_PVS_CONN_SUCCESS')}
      </span>
      {either(
        versionChecked,
        <button
          className="button is-primary is-uppercase is-center"
          onClick={goToScanLabels}
        >
          {t('CONTINUE')}
        </button>,
        <span className="has-text-centered has-text-white">
          {t('CHECKING_UPDATES')}
        </span>
      )}
    </div>
  )
}

export default PvsConnectionSuccessful
