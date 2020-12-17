import React, { useEffect, useState } from 'react'
import { endsWith, equals, isEmpty, path, pathOr, pluck } from 'ramda'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import SwipeableBottomSheet from 'react-swipeable-bottom-sheet'

import paths from 'routes/paths'
import { useI18n } from 'shared/i18n'
import { FETCH_DEVICES_LIST, UPDATE_DEVICES_LIST } from 'state/actions/devices'
import PanelLayoutWidget from 'pages/SystemConfiguration/panelLayoutWidget'
import useSiteChanged from 'hooks/useHasSiteChanged'
import { CONFIG_START } from 'state/actions/analytics'
import {
  REPLACE_RMA_PVS,
  SUBMIT_CONFIG
} from 'state/actions/systemConfiguration'
import { useShowModal } from 'hooks/useGlobalModal'

import GridBehaviorWidget from './GridBehaviorWidget'
import InterfacesWidget from './InterfacesWidget'
import MetersWidget from './MetersWidget'
import NetworkWidget from './NetworkWidget'
import RSEWidget from './RSEWidget'

import './SystemConfiguration.scss'

const createMeterConfig = (devicesList, meterConfig, dispatch, site) => {
  const updatedDevices = devicesList.map(device => {
    if (
      device.DEVICE_TYPE === 'Power Meter' &&
      endsWith('p', device.SERIAL) &&
      meterConfig.productionCT
    ) {
      device.SUBTYPE = meterConfig.productionCT
    }

    if (
      device.DEVICE_TYPE === 'Power Meter' &&
      endsWith('c', device.SERIAL) &&
      meterConfig.consumptionCT
    ) {
      device.SUBTYPE = meterConfig.consumptionCT
    }

    return device
  })

  dispatch(UPDATE_DEVICES_LIST(updatedDevices))

  return {
    metaData: {
      site_key: site,
      devices: updatedDevices
    }
  }
}

function SystemConfiguration() {
  const t = useI18n()
  const dispatch = useDispatch()
  const history = useHistory()
  const siteChanged = useSiteChanged()
  const [commissionBlockModal, showCommissionBlockModal] = useState(false)

  const { wpsSupport } = useSelector(state => state.pvs)
  const { selectedOptions } = useSelector(
    state => state.systemConfiguration.gridBehavior
  )
  const { canCommission } = useSelector(
    pathOr({}, ['systemConfiguration', 'submit'])
  )

  const { meter } = useSelector(state => state.systemConfiguration)
  const { found } = useSelector(state => state.devices)

  const siteKey = useSelector(path(['site', 'site', 'siteKey']))
  const rmaMode = useSelector(path(['rma', 'rmaMode']))
  const replacingPvs = equals('REPLACE_PVS', rmaMode)

  const foundDeviceTypes = pluck('TYPE', found)
  const storageDeviceTypes = [
    'EQUINOX-MIO',
    'GATEWAY',
    'SCHNEIDER-XWPRO',
    'EQUINOX-BMS',
    'BATTERY',
    'EQUINOX-ESS'
  ]
  const areInStorageDeviceList = deviceType =>
    storageDeviceTypes.includes(deviceType)
  const hasStorage = foundDeviceTypes.some(areInStorageDeviceList)

  const validateConfig = configObject => {
    for (const value of Object.values(configObject)) {
      if (value == null) {
        return false
      }
    }
    return true
  }

  const generateConfigObject = () => {
    const metaData = createMeterConfig(found, meter, dispatch, siteKey)
    return {
      metaData,
      gridProfile: selectedOptions.profile.id,
      lazyGridProfile: selectedOptions.lazyGridProfile,
      exportLimit: selectedOptions.exportLimit,
      gridVoltage: selectedOptions.gridVoltage
    }
  }

  const submitConfig = () => {
    if (!canCommission) {
      showCommissionBlockModal(true)
    } else {
      try {
        const configObject = generateConfigObject()
        if (!configObject.gridVoltage) {
          showNoGridModal()
        } else {
          if (validateConfig(configObject)) {
            dispatch(
              replacingPvs
                ? REPLACE_RMA_PVS(configObject)
                : SUBMIT_CONFIG(configObject)
            )
            dispatch(CONFIG_START(siteChanged))
            history.push(paths.PROTECTED.SAVING_CONFIGURATION.path)
          } else {
            showErrorConfigurationModal()
          }
        }
      } catch (err) {
        console.error(err)
      }
    }
  }

  const forceSubmit = () => {
    const configObject = generateConfigObject()
    replacingPvs
      ? dispatch(REPLACE_RMA_PVS(configObject))
      : dispatch(SUBMIT_CONFIG(configObject))
    history.push(paths.PROTECTED.SAVING_CONFIGURATION.path)
  }
  const showErrorConfigurationModal = useShowModal({
    title: t('ATTENTION'),
    componentPath: './ErrorSystemConfiguration.jsx',
    componentProps: { forceSubmit },
    dismissable: true
  })
  const showNoGridModal = useShowModal({
    title: t('ATTENTION'),
    componentPath: './NoGridModal.jsx',
    dismissable: true
  })
  useEffect(() => {
    dispatch(FETCH_DEVICES_LIST())
  }, [dispatch])

  return (
    <div className="fill-parent is-flex tile is-vertical has-text-centered system-config pl-10 pr-10 mb-40">
      <span className="is-uppercase has-text-weight-bold mb-20">
        {t('SYSTEM_CONFIGURATION')}
      </span>
      <div className="mb-15">
        <InterfacesWidget />
      </div>
      <NetworkWidget hideWPSButton={!wpsSupport} />
      <GridBehaviorWidget />
      <MetersWidget hasStorage={hasStorage} />
      <RSEWidget />
      <PanelLayoutWidget />
      <div className="submit-config pt-15">
        <button
          onClick={submitConfig}
          className="button is-primary is-uppercase"
          disabled={isEmpty(found)}
        >
          {t('SUBMIT_CONFIG')}
        </button>
      </div>

      <SwipeableBottomSheet
        shadowTip={false}
        open={commissionBlockModal}
        onChange={() => showCommissionBlockModal(!commissionBlockModal)}
      >
        <div className="tile is-vertical has-text-centered is-flex">
          <span className="has-text-weight-bold">{t('HOLD_ON')}</span>
          <span className="mt-10 mb-10">{t('COMMISSION_BLOCKED')}</span>
          <div className="mt-10 mb-20">
            <button
              className="button is-primary"
              onClick={() => showCommissionBlockModal(false)}
            >
              {t('CLOSE')}
            </button>
          </div>
        </div>
      </SwipeableBottomSheet>
    </div>
  )
}

export default SystemConfiguration
