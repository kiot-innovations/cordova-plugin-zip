import React, { useEffect } from 'react'
import { pathOr } from 'ramda'
import { useI18n } from 'shared/i18n'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import {
  START_COMMISSIONING_INIT,
  START_DISCOVERY_INIT
} from 'state/actions/pvs'

import paths from 'routes/paths'

import NetworkWidget from 'pages/SystemConfiguration/NetworkWidget'

import './PVSProvideInternet.scss'
import { either } from 'shared/utils'

const PVSProvideInternet = () => {
  const t = useI18n()
  const history = useHistory()
  const dispatch = useDispatch()

  const versionChecked = useSelector(
    pathOr(false, ['firmwareUpdate', 'canContinue'])
  )

  const { isConnected } = useSelector(
    pathOr(false, ['systemConfiguration', 'network'])
  )

  const goToScanLabels = () => {
    history.push(paths.PROTECTED.SCAN_LABELS.path)
  }

  useEffect(() => {
    if (versionChecked) {
      dispatch(START_COMMISSIONING_INIT())
      dispatch(
        START_DISCOVERY_INIT({ Device: 'allnomi', Interfaces: ['mime'] })
      )
    }
  }, [dispatch, versionChecked])

  return (
    <div className="pvs-provide-internet full-height pr-20 pl-20">
      <p className="is-uppercase has-text-centered has-text-weight-bold">
        {t('CONFIGURE_NETWORK')}
      </p>

      <NetworkWidget expanded hideWPSButton />

      {either(
        isConnected,
        null,
        <div className="pvs-sn is-flex has-text-white is-size-6 is-bold is-text has-text-centered">
          {t('PVS_PROVIDE_INTERNET')}
        </div>
      )}

      <div className="container is-flex">
        <button
          className="button is-primary is-uppercase is-center auto"
          disabled={!isConnected}
          onClick={goToScanLabels}
        >
          {t('CONTINUE')}
        </button>
      </div>
    </div>
  )
}

export default PVSProvideInternet
