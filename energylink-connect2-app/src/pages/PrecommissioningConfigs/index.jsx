import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import {
  endsWith,
  filter,
  find,
  isEmpty,
  length,
  path,
  pathOr,
  propEq
} from 'ramda'
import SwipeableSheet from 'hocs/SwipeableSheet'

import { useI18n } from 'shared/i18n'
import paths from 'routes/paths'

import { START_DISCOVERY_INIT } from 'state/actions/pvs'
import {
  PUSH_CANDIDATES_INIT,
  RESET_DISCOVERY_PROGRESS,
  UPDATE_DEVICES_LIST
} from 'state/actions/devices'
import { SUBMIT_PRECONFIG_GRIDPROFILE } from 'state/actions/systemConfiguration'
import { GRID_PROFILE_UPLOAD_INIT } from 'state/actions/firmwareUpdate'
import { MIS_DISCOVERY_START_TIMER } from 'state/actions/analytics'

import { discoveryTypes } from 'state/reducers/devices'
import { rmaModes } from 'state/reducers/rma'
import { preconfigStates } from 'state/reducers/systemConfiguration/submitConfiguration'
import { fwupStatus } from 'state/reducers/firmware-update'

import { Loader } from 'components/Loader'
import ColoredBanner, { bannerCategories } from 'components/ColoredBanner'
import GridBehaviorWidget from 'pages/SystemConfiguration/GridBehaviorWidget'
import MetersWidget from 'pages/SystemConfiguration/MetersWidget'

import { either, generateCandidates } from 'shared/utils'

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
  dispatch(MIS_DISCOVERY_START_TIMER())

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
        const candidates = generateCandidates(serialNumbers)
        dispatch(PUSH_CANDIDATES_INIT(candidates))
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
  const [gridProfilesModal, showGridProfilesModal] = useState(false)
  const [canContinue, setCanContinue] = useState(false)
  const [productionCTModal, showProductionCTModal] = useState(false)

  const siteKey = useSelector(path(['site', 'site', 'siteKey']))

  const { status } = useSelector(state => state.firmwareUpdate)
  const { gridBehavior, meter } = useSelector(
    state => state.systemConfiguration
  )

  const { preconfigState, preconfigError } = useSelector(
    path(['systemConfiguration', 'submit'])
  )
  const { selectedOptions } = gridBehavior
  const { rmaMode, newEquipment, rma } = useSelector(state => state.rma)
  const { bom } = useSelector(state => state.inventory)
  const { found, isFetching, discoveryComplete } = useSelector(
    state => state.devices
  )
  const { serialNumbers } = useSelector(state => state.pvs)

  const { canAccessScandit } = useSelector(state => state.global)

  const storageValue = find(propEq('item', 'ESS'), bom) || { value: '0' }
  const miValue = find(propEq('item', 'AC_MODULES'), bom) || { value: '0' }

  const uploadingOrFetchingProfiles =
    status === fwupStatus.UPLOADING_GRID_PROFILES ||
    status === fwupStatus.UPGRADE_COMPLETE ||
    gridBehavior.fetchingGridBehavior === true

  const errorWhileFetchingProfiles =
    status === fwupStatus.ERROR_GRID_PROFILE || !isEmpty(gridBehavior.err)

  const submitConfig = () => {
    if (propEq('productionCT', 'NOT_USED')(meter)) {
      showProductionCTModal(true)
    } else {
      showSubmitModal(true)
      const { metaData } = createMeterConfig(found, meter, siteKey)
      dispatch(UPDATE_DEVICES_LIST(metaData.devices))
      const configObject = generateConfigObject(metaData, selectedOptions)
      dispatch(SUBMIT_PRECONFIG_GRIDPROFILE(configObject))
    }
  }

  const meters = filter(propEq('DEVICE_TYPE', 'Power Meter'), found)
  const areOnboardMetersMissing = !isFetching && length(meters) < 2

  const retryDiscovery = () => {
    dispatch(RESET_DISCOVERY_PROGRESS())
    dispatch(
      START_DISCOVERY_INIT({
        Device: 'allnomi',
        Interfaces: ['mime'],
        type: discoveryTypes.ALLNOMI
      })
    )
  }

  useEffect(() => {
    if (!isEmpty(gridBehavior.profiles)) {
      showGridProfilesModal(false)
    } else {
      if (isEmpty(gridBehavior.profiles) && gridProfilesModal === false) {
        showGridProfilesModal(true)
      }
    }
  }, [gridBehavior.profiles, gridProfilesModal])

  useEffect(() => {
    const { metaData } = createMeterConfig(found, meter, siteKey)
    const configObject = generateConfigObject(metaData, selectedOptions)
    setCanContinue(validateConfig(configObject))
  }, [dispatch, found, meter, selectedOptions, siteKey])

  useEffect(() => {
    if (!isFetching && !discoveryComplete) {
      dispatch(RESET_DISCOVERY_PROGRESS())
      dispatch(
        START_DISCOVERY_INIT({
          Device: 'allnomi',
          Interfaces: ['mime'],
          type: discoveryTypes.ALLNOMI
        })
      )
    }
  }, [dispatch, discoveryComplete, isFetching])

  return (
    <div className="precommissioning-configs pr-20 pl-20 full-height">
      <div className="has-text-weight-bold is-uppercase has-text-centered mb-15">
        {t('SITE_SETTINGS')}
      </div>
      <div>
        {either(
          areOnboardMetersMissing,
          <ColoredBanner
            category={bannerCategories.ERROR}
            text={t('METERS_NOT_FOUND')}
            actionText={t('RETRY_DISCOVERY')}
            action={retryDiscovery}
            className="mb-15"
          />
        )}
        {either(
          isFetching,
          <div className="mt-10 mb-10 loading-banner">
            <div className="loading-banner--title">
              <span>{t('LOOKING_FOR_METERS')}</span>
            </div>
            <div className="loading-banner--loader loader" />
          </div>
        )}
        <div className="mt-10 mb-10">
          <GridBehaviorWidget />
          <MetersWidget hasStorage={storageValue.value !== '0'} />
        </div>
      </div>
      <div>
        <div className="has-text-centered mb-10">{t('SITE_SETTINGS_HINT')}</div>
        <div className="has-text-centered">
          <button
            className="button is-primary"
            onClick={submitConfig}
            disabled={!canContinue || areOnboardMetersMissing}
          >
            {t('CONTINUE')}
          </button>
        </div>
      </div>

      <SwipeableSheet open={submitModal}>
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
      </SwipeableSheet>

      <SwipeableSheet onChange={showProductionCTModal} open={productionCTModal}>
        <div className="is-flex flex-column has-text-centered">
          <div className="mb-10">
            <span className="sp-hey has-text-white is-size-1" />
          </div>
          <div className="mb-10">
            <span className="has-text-white">
              {t('PRODUCTION_CT_REQUIRED')}
            </span>
          </div>
          <div className="mb-10">
            <button
              className="button is-primary"
              onClick={() => showProductionCTModal(false)}
            >
              {t('OK')}
            </button>
          </div>
        </div>
      </SwipeableSheet>

      <SwipeableSheet
        onChange={() => showGridProfilesModal(!gridProfilesModal)}
        open={gridProfilesModal}
      >
        <div className="is-flex flex-column has-text-centered has-text-white">
          {either(
            uploadingOrFetchingProfiles,
            <>
              <div>
                <Loader />
              </div>
              <div>
                <span>{t('FETCHING_GRID_PROFILES')}</span>
              </div>
            </>,
            errorWhileFetchingProfiles ? (
              <>
                <div>
                  <span className="sp-hey is-size-1" />
                </div>
                <div className="mt-20 mb-10">
                  <span className="">{t('FETCHING_GRID_PROFILES_ERROR')}</span>
                </div>
                <div>
                  <button
                    onClick={() => dispatch(GRID_PROFILE_UPLOAD_INIT())}
                    className="button is-primary"
                  >
                    {t('RETRY')}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <Loader />
                </div>
                <div>
                  <span>{t('FETCHING_GRID_PROFILES')}</span>
                </div>
              </>
            )
          )}
        </div>
      </SwipeableSheet>
    </div>
  )
}

export default PrecommissioningConfigs
