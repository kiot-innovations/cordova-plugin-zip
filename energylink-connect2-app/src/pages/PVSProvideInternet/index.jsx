import React, { useEffect } from 'react'
import { pathOr } from 'ramda'
import clsx from 'clsx'
import { useI18n } from 'shared/i18n'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import {
  START_COMMISSIONING_INIT,
  START_DISCOVERY_INIT
} from 'state/actions/pvs'
import { PUSH_CANDIDATES_INIT } from 'state/actions/devices'
import { rmaModes } from 'state/reducers/rma'

import paths from 'routes/paths'

import InterfacesWidget from 'pages/SystemConfiguration/InterfacesWidget'
import NetworkWidget from 'pages/SystemConfiguration/NetworkWidget'

import './PVSProvideInternet.scss'
import { either } from 'shared/utils'

const PVSProvideInternet = () => {
  const t = useI18n()
  const history = useHistory()
  const dispatch = useDispatch()

  const { rmaMode, newEquipment, rma } = useSelector(state => state.rma)
  const { serialNumbers } = useSelector(state => state.pvs)

  const versionChecked = useSelector(
    pathOr(false, ['firmwareUpdate', 'canContinue'])
  )

  const { isConnected } = useSelector(
    pathOr(false, ['systemConfiguration', 'network'])
  )

  const { canAccessScandit } = useSelector(state => state.global)

  const goToScanLabels = () => {
    // If we're going through a PVS replacement
    if (rmaMode === rmaModes.REPLACE_PVS) {
      // If there's new equipment, take them to inventory count
      if (newEquipment) {
        history.push(paths.PROTECTED.RMA_INVENTORY.path)
      } else {
        // If there's no new equipment
        if (pathOr(false, ['other'], rma)) {
          // Do a legacy discovery if site contains legacy devices.
          dispatch(START_DISCOVERY_INIT({ Device: 'allplusmime' }))
          history.push(paths.PROTECTED.LEGACY_DISCOVERY.path)
        } else {
          // Do a standard MI discovery if site doesn't contain legacy devices.
          dispatch(PUSH_CANDIDATES_INIT(serialNumbers))
          history.push(paths.PROTECTED.DEVICES.path)
        }
      }
    } else
      history.push(
        canAccessScandit
          ? paths.PROTECTED.SCAN_LABELS.path
          : paths.PROTECTED.SN_LIST.path
      )
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

      <div className="mb-10">
        <InterfacesWidget />
      </div>
      <NetworkWidget expanded hideWPSButton />

      {either(
        isConnected,
        null,
        <div className="has-text-white is-size-6 is-bold is-text has-text-centered">
          {t('PVS_PROVIDE_INTERNET')}
        </div>
      )}

      <div className="container is-flex">
        <button
          className={clsx(
            'button is-uppercase is-center auto continue-button',
            isConnected ? 'is-primary' : 'is-secondary'
          )}
          onClick={goToScanLabels}
        >
          {t(isConnected ? 'CONTINUE' : 'NOT_NOW')}
        </button>
      </div>
    </div>
  )
}

export default PVSProvideInternet
