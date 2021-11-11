import {
  endsWith,
  equals,
  path,
  pathOr,
  pluck,
  compose,
  isEmpty,
  isNil,
  length,
  map,
  cond,
  not,
  pipe,
  prop,
  always
} from 'ramda'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import GridBehaviorWidget from './GridBehaviorWidget'
import InterfacesWidget from './InterfacesWidget'
import MetersWidget from './MetersWidget'
import NetworkWidget from './NetworkWidget'
import RSEWidget from './RSEWidget'

import { Loader } from 'components/Loader'
import SwipeableSheet from 'hocs/SwipeableSheet'
import { useShowModal } from 'hooks/useGlobalModal'
import useSiteKey from 'hooks/useSiteKey'
import PanelLayoutWidget from 'pages/SystemConfiguration/panelLayoutWidget'
import paths from 'routes/paths'
import { useFeatureFlag } from 'shared/featureFlags'
import { useI18n } from 'shared/i18n'
import { submitConfigErrorMap } from 'shared/utils'
import { CONFIG_START } from 'state/actions/analytics'
import { FETCH_DEVICES_LIST, UPDATE_DEVICES_LIST } from 'state/actions/devices'
import {
  ALLOW_COMMISSIONING,
  REPLACE_RMA_PVS,
  SUBMIT_CONFIG
} from 'state/actions/systemConfiguration'
import { rmaModes } from 'state/reducers/rma'
import { GRID_ERRORS } from 'state/reducers/systemConfiguration/gridBehavior'
import { METER, METER_ERRORS } from 'state/reducers/systemConfiguration/meter'
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

const renderValidationError = ve => <ol key={ve}>{ve}</ol>

function SystemConfiguration() {
  const t = useI18n()
  const dispatch = useDispatch()
  const history = useHistory()
  const ctCheckPermissions = useFeatureFlag({
    page: 'any-page',
    name: 'ct-checks-staged-rollout'
  })
  const [commissionBlockModal, showCommissionBlockModal] = useState(false)
  const [validationErrors, setValidationErrors] = useState([])

  const { fwVersion, wpsSupport } = useSelector(state => state.pvs)
  const { selectedOptions } = useSelector(
    state => state.systemConfiguration.gridBehavior
  )
  const { canCommission } = useSelector(
    pathOr({}, ['systemConfiguration', 'submit'])
  )

  const { meter } = useSelector(state => state.systemConfiguration)
  const { found } = useSelector(state => state.devices)

  const siteKey = useSiteKey()
  const rmaMode = useSelector(path(['rma', 'rmaMode']))

  const { submitting, submitted, error } = useSelector(
    state => state.systemConfiguration.submit
  )

  const [submitModal, setSubmitModal] = useState(
    submitting || submitted || error
  )

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
      exportLimit: selectedOptions.exportLimit,
      gridVoltage: selectedOptions.gridVoltage
    }
  }

  const validateData = () => {
    const { productionCT } = meter
    const errors = []
    if (productionCT !== METER.GROSS_PRODUCTION_SITE)
      errors.push(METER_ERRORS.PRODUCTION_CT_NOT_SET)
    const { profile } = selectedOptions
    if (isEmpty(profile) || isNil(profile))
      errors.push(GRID_ERRORS.NO_PROFILE_AVAILABLE)
    setValidationErrors(errors)
    return length(errors) < 1
  }

  const submitConfig = isValidConfig => {
    console.info({ isValidConfig })
    if (!isValidConfig) return

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
            dispatch(CONFIG_START())
            setSubmitModal(true)
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
    setSubmitModal(true)
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
    dispatch(CONFIG_START())
    dispatch(FETCH_DEVICES_LIST())
  }, [dispatch])

  useEffect(() => {
    if (rmaMode === rmaModes.EDIT_DEVICES) dispatch(ALLOW_COMMISSIONING())
  }, [rmaMode, dispatch])

  const closeModalAndRedirect = to => {
    setSubmitModal(false)
    history.push(to)
  }

  const configStatusContent = cond([
    [
      pipe(prop('submitting'), equals(true)),
      always(
        <>
          <p className="mt-10 mb-10 has-text-weight-bold">
            {t('SAVING_CONFIGURATION')}
          </p>
          <Loader />
        </>
      )
    ],
    [
      pipe(prop('error'), isEmpty, not),
      always(
        <>
          <p className="mt-10 mb-10 has-text-weight-bold">
            {t('CONFIG_ERROR')}
          </p>
          <div>
            <p className="mt-10">{submitConfigErrorMap(error, t)}</p>
            <button
              className="button is-primary isfullwidth is-uppercase mt-15"
              onClick={() => setSubmitModal(false)}
            >
              {t('CLOSE')}
            </button>
          </div>
        </>
      )
    ],
    [
      pipe(prop('submitted'), equals(true)),
      always(
        ctCheckPermissions && fwVersion >= 60400 ? (
          <>
            <div>
              <p className="mt-10 mb-10 has-text-weight-bold">
                {t('SAVED_CONFIGURATION')}
              </p>
              <p className="mb-5">{t('CT_CHECKS_PROMPT')}</p>
              <p className="mb-10">{t('CT_CHECKS_PROMPT_2')}</p>
            </div>
            <div className="pvs-buttons is-flex mb-10">
              <button
                className="button is-primary is-outlined is-fullwidth is-uppercase mr-10"
                onClick={() =>
                  closeModalAndRedirect(
                    paths.PROTECTED.SAVING_CONFIGURATION.path
                  )
                }
              >
                {t('SKIP')}
              </button>
              <button
                className="button is-primary is-fullwidth is-uppercase ml-10"
                onClick={() =>
                  closeModalAndRedirect(paths.PROTECTED.SYSTEM_CHECKS.path)
                }
              >
                {t('SYSTEM_CHECKS')}
              </button>
            </div>
          </>
        ) : (
          <>
            <div>
              <p className="mt-10 mb-10 has-text-weight-bold">
                {t('SAVED_CONFIGURATION')}
              </p>
            </div>
            <div className="pvs-buttons is-flex mb-10">
              <button
                className="button is-primary is-outlined is-fullwidth is-uppercase mr-10"
                onClick={() =>
                  closeModalAndRedirect(
                    paths.PROTECTED.SAVING_CONFIGURATION.path
                  )
                }
              >
                {t('CONTINUE')}
              </button>
            </div>
          </>
        )
      )
    ]
  ])

  return (
    <div className="fill-parent is-flex tile is-vertical has-text-centered system-config pl-10 pr-10 mb-40">
      <span className="is-uppercase has-text-weight-bold mb-20">
        {t('SYSTEM_CONFIGURATION')}
      </span>
      <div className="mb-15">
        <InterfacesWidget />
      </div>
      <p className="mb-10 has-text-right">
        <span className="has-text-danger mr-5">*</span>
        {t('MANDATORY_FIELDS')}
      </p>
      <div className="pb-15">
        <NetworkWidget hideWPSButton={!wpsSupport} />
      </div>
      <GridBehaviorWidget />
      <MetersWidget hasStorage={hasStorage} />
      <RSEWidget />
      <PanelLayoutWidget />
      <div className="submit-config pt-15">
        <button
          onClick={compose(submitConfig, validateData)}
          className="button is-primary is-uppercase"
          disabled={isEmpty(found) || submitting}
        >
          {t('SUBMIT_CONFIG')}
        </button>
      </div>

      <SwipeableSheet
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
      </SwipeableSheet>

      <SwipeableSheet
        open={length(validationErrors) > 0}
        onChange={() => setValidationErrors([])}
      >
        <div className="tile is-vertical has-text-centered is-flex">
          <span className="has-text-weight-bold">
            {t('FIX_VALIDATION_ERRORS')}
          </span>
          <div className="mt-10 mb-10">
            <ul>{map(compose(renderValidationError, t), validationErrors)}</ul>
          </div>
          <div className="mt-10 mb-20">
            <button
              className="button is-primary"
              onClick={() => setValidationErrors([])}
            >
              {t('CLOSE')}
            </button>
          </div>
        </div>
      </SwipeableSheet>

      <SwipeableSheet shadowTip={false} open={submitModal}>
        <div className="tile is-vertical has-text-centered is-flex">
          {configStatusContent({ submitting, submitted, error })}
        </div>
      </SwipeableSheet>
    </div>
  )
}

export default SystemConfiguration
