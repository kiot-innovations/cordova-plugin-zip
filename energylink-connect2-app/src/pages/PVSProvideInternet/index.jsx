import React, { useEffect } from 'react'
import { find, pathOr, propEq, isEmpty, isNil, path } from 'ramda'
import { useI18n } from 'shared/i18n'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import {
  START_COMMISSIONING_INIT,
  START_DISCOVERY_INIT
} from 'state/actions/pvs'
import { PUSH_CANDIDATES_INIT } from 'state/actions/devices'
import { discoveryTypes } from 'state/reducers/devices'
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
  const { serialNumbers, wpsSupport } = useSelector(state => state.pvs)
  const { isConnecting } = useSelector(path(['systemConfiguration', 'network']))

  const { bom } = useSelector(state => state.inventory)
  const miValue = find(propEq('item', 'AC_MODULES'), bom)
  const storageValue = find(propEq('item', 'ESS'), bom)

  const versionChecked = useSelector(
    pathOr(false, ['firmwareUpdate', 'canContinue'])
  )

  const { isOnline } = useSelector(pathOr(false, ['network']))
  const { isFetching } = useSelector(
    pathOr(false, ['systemConfiguration', 'interfaces'])
  )

  const { canAccessScandit } = useSelector(state => state.global)

  const warmUp = ({ Device, type, Interfaces }) => {
    const options = { Device, type }
    if (Interfaces) options.Interfaces = Interfaces
    dispatch(START_COMMISSIONING_INIT())
    dispatch(START_DISCOVERY_INIT(options))
  }

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
          warmUp({ Device: 'allplusmime', type: discoveryTypes.LEGACY })
          history.push(paths.PROTECTED.LEGACY_DISCOVERY.path)
        } else {
          // Do a standard MI discovery if site doesn't contain legacy devices.
          dispatch(PUSH_CANDIDATES_INIT(serialNumbers))
          history.push(paths.PROTECTED.RMA_MI_DISCOVERY.path)
        }
      }
    } else {
      if (versionChecked)
        warmUp({
          Device: 'allnomi',
          Interfaces: ['mime'],
          type: discoveryTypes.ALLNOMI
        })

      if (rmaMode === rmaModes.EDIT_DEVICES) {
        history.push(paths.PROTECTED.RMA_DEVICES.path)
      } else {
        if (miValue.value > 0) {
          history.push(
            canAccessScandit
              ? paths.PROTECTED.SCAN_LABELS.path
              : paths.PROTECTED.SN_LIST.path
          )
        } else {
          if (storageValue.value !== '0') {
            history.push(paths.PROTECTED.STORAGE_PREDISCOVERY.path)
          } else {
            history.push(paths.PROTECTED.SYSTEM_CONFIGURATION.path)
          }
        }
      }
    }
  }

  const shouldConnect =
    !isOnline || isEmpty(isOnline) || isNil(isOnline) || isConnecting

  useEffect(() => {
    if (versionChecked) {
      dispatch(START_COMMISSIONING_INIT())

      //the user can always trigger RMA by clicking rediscover later
      if (rmaMode === rmaModes.NONE) {
        dispatch(
          START_DISCOVERY_INIT({
            Device: 'allnomi',
            Interfaces: ['mime'],
            type: discoveryTypes.ALLNOMI
          })
        )
      }
    }
  }, [dispatch, versionChecked, rmaMode])

  return (
    <div className="pvs-provide-internet full-height pr-20 pl-20">
      <p className="is-uppercase has-text-centered has-text-weight-bold">
        {t('CONFIGURE_NETWORK')}
      </p>

      <div className="mb-10">
        <InterfacesWidget />
      </div>
      <NetworkWidget
        expanded={shouldConnect && !isFetching}
        hideWPSButton={!wpsSupport}
      />

      {either(
        shouldConnect,
        <div className="has-text-white is-size-6 is-bold is-text has-text-centered mb-10">
          {t(isFetching ? 'PVS_CHECKING_INTERNET' : 'PVS_PROVIDE_INTERNET')}
        </div>
      )}

      <div className="container is-flex">
        <button
          className="button is-uppercase is-center auto continue-button is-primary"
          disabled={shouldConnect}
          onClick={goToScanLabels}
        >
          {t('CONTINUE')}
        </button>
      </div>
    </div>
  )
}

export default PVSProvideInternet
