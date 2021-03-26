import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { endsWith, find, path, pathOr, propEq } from 'ramda'
import SwipeableBottomSheet from 'react-swipeable-bottom-sheet'

import { useI18n } from 'shared/i18n'
import paths from 'routes/paths'

import { START_DISCOVERY_INIT } from 'state/actions/pvs'
import {
  PUSH_CANDIDATES_INIT,
  UPDATE_DEVICES_LIST
} from 'state/actions/devices'
import { SUBMIT_PRECONFIG_GRIDPROFILE } from 'state/actions/systemConfiguration'

import { discoveryTypes } from 'state/reducers/devices'
import { rmaModes } from 'state/reducers/rma'
import { preconfigStates } from 'state/reducers/systemConfiguration/submitConfiguration'

import { Loader } from 'components/Loader'
import GridBehaviorWidget from 'pages/SystemConfiguration/GridBehaviorWidget'
import MetersWidget from 'pages/SystemConfiguration/MetersWidget'

import { either } from 'shared/utils'

import './PrecommissioningConfigs.scss'

const createMeterConfig = (devicesList = [], meterConfig, site) => {
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

  return {
    metaData: {
      site_key: site,
      devices: updatedDevices
    }
  }
}

const validateConfig = configObject => {
  console.info({ configObject }, 'configObject')

  if (!configObject.metaData || !configObject.metaData.site_key) return false
  for (const value of Object.values(configObject)) {
    if (value == null) {
      return false
    }
  }
  return true
}

const generateConfigObject = (metaData, selectedOptions) => ({
  metaData,
  gridProfile: selectedOptions.profile.id,
  exportLimit: selectedOptions.exportLimit,
  gridVoltage: selectedOptions.gridVoltage
})

const continueCommissioning = (
  rma,
  rmaMode,
  newEquipment,
  miValue,
  canAccessScandit,
  storageValue,
  serialNumbers,
  history,
  dispatch
) => {
  // If we're going through a PVS replacement
  if (rmaMode === rmaModes.REPLACE_PVS) {
    // If there's new equipment, take them to inventory count
    if (newEquipment) {
      history.push(paths.PROTECTED.RMA_INVENTORY.path)
    } else {
      // If there's no new equipment
      if (pathOr(false, ['other'], rma)) {
        // Do a legacy discovery if site contains legacy devices.
        dispatch(
          START_DISCOVERY_INIT({
            Device: 'allplusmime',
            type: discoveryTypes.LEGACY
          })
        )
        history.push(paths.PROTECTED.LEGACY_DISCOVERY.path)
      } else {
        // Do a standard MI discovery if site doesn't contain legacy devices.
        dispatch(PUSH_CANDIDATES_INIT(serialNumbers))
        history.push(paths.PROTECTED.RMA_MI_DISCOVERY.path)
      }
    }
  } else if (rmaMode === rmaModes.EDIT_DEVICES) {
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

const PrecommissioningConfigs = () => {
  const t = useI18n()
  const history = useHistory()
  const dispatch = useDispatch()
  const [submitModal, showSubmitModal] = useState(false)
  const [canContinue, setCanContinue] = useState(false)

  const siteKey = useSelector(path(['site', 'site', 'siteKey']))

  const { gridBehavior, meter } = useSelector(
    state => state.systemConfiguration
  )

  const { preconfigState, preconfigError } = useSelector(
    path(['systemConfiguration', 'submit'])
  )
  const { selectedOptions } = gridBehavior
  const { rmaMode, newEquipment, rma } = useSelector(state => state.rma)
  const { bom } = useSelector(state => state.inventory)
  const { serialNumbers, found } = useSelector(state => state.devices)

  const { canAccessScandit } = useSelector(state => state.global)

  const storageValue = find(propEq('item', 'ESS'), bom) || { value: '0' }
  const miValue = find(propEq('item', 'AC_MODULES'), bom) || { value: '0' }

  const submitConfig = () => {
    showSubmitModal(true)
    const { metaData } = createMeterConfig(found, meter, siteKey)
    dispatch(UPDATE_DEVICES_LIST(metaData.devices))
    const configObject = generateConfigObject(metaData, selectedOptions)
    dispatch(SUBMIT_PRECONFIG_GRIDPROFILE(configObject))
  }

  useEffect(() => {
    const { metaData } = createMeterConfig(found, meter, siteKey)
    const configObject = generateConfigObject(metaData, selectedOptions)
    setCanContinue(validateConfig(configObject))
  }, [dispatch, found, meter, selectedOptions, siteKey])

  return (
    <div className="precommissioning-configs pr-20 pl-20 full-height">
      <div className="has-text-weight-bold is-uppercase has-text-centered mb-15">
        {t('SITE_SETTINGS')}
      </div>
      <div className="mt-10 mb-10">
        <GridBehaviorWidget />
        <MetersWidget hasStorage={storageValue.value !== '0'} />
      </div>
      <div>
        <div className="has-text-centered mb-10">{t('SITE_SETTINGS_HINT')}</div>
        <div className="has-text-centered">
          <button
            className="button is-primary"
            onClick={submitConfig}
            disabled={!canContinue}
          >
            {t('CONTINUE')}
          </button>
        </div>
      </div>

      <SwipeableBottomSheet shadowTip={false} open={submitModal}>
        <div className="applying-settings is-flex has-text-centered">
          {either(
            preconfigState === preconfigStates.STARTED,
            <>
              <Loader />
              <span className="mt-20 has-text-white has-text-weight-bold">
                {t('APPLYING_PRECOMM_CONFIG')}
              </span>
            </>
          )}
          {either(
            preconfigState === preconfigStates.SUCCESS,
            <>
              <span className="sp-check has-text-white is-size-1" />
              <span className="mt-20">{t('PRECOMM_SETTINGS_APPLIED')}</span>
              <div className="mt-20 mb-10">
                <button
                  className="button is-primary"
                  onClick={() =>
                    continueCommissioning(
                      rma,
                      rmaMode,
                      newEquipment,
                      miValue,
                      canAccessScandit,
                      storageValue,
                      serialNumbers,
                      history,
                      dispatch
                    )
                  }
                >
                  {t('CONTINUE')}
                </button>
              </div>
            </>
          )}
          {either(
            preconfigState === preconfigStates.ERROR,
            <>
              <span className="sp-hey has-text-white is-size-1" />
              <span className="mt-20">{t(preconfigError)}</span>
              <div className="mt-20 mb-10">
                <button
                  className="button is-primary"
                  onClick={() => showSubmitModal(false)}
                >
                  {t('RETRY')}
                </button>
              </div>
            </>
          )}
        </div>
      </SwipeableBottomSheet>
    </div>
  )
}

export default PrecommissioningConfigs
