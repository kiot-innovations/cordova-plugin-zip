import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { endsWith, path } from 'ramda'
import { useI18n } from 'shared/i18n'
import { SUBMIT_CONFIG } from 'state/actions/systemConfiguration'
import { UPDATE_DEVICES_LIST } from 'state/actions/devices'
import { SET_METADATA_INIT } from 'state/actions/pvs'

import paths from 'routes/paths'
import useModal from 'hooks/useModal'

import InterfacesWidget from './InterfacesWidget'
import GridBehaviorWidget from './GridBehaviorWidget'
import MetersWidget from './MetersWidget'
import StorageWidget from './StorageWidget'
import NetworkWidget from './NetworkWidget'
import RSEWidget from './RSEWidget'

import './SystemConfiguration.scss'

const applyMeterConfig = (devicesList, meterConfig, dispatch, site) => {
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

  dispatch(
    SET_METADATA_INIT({
      metaData: {
        site_key: site,
        devices: updatedDevices
      }
    })
  )
  dispatch(UPDATE_DEVICES_LIST(updatedDevices))
}

function SystemConfiguration() {
  const t = useI18n()
  const dispatch = useDispatch()
  const history = useHistory()

  const { selectedOptions } = useSelector(
    state => state.systemConfiguration.gridBehavior
  )

  const { meter } = useSelector(state => state.systemConfiguration)
  const { found } = useSelector(state => state.devices)

  const siteKey = useSelector(path(['site', 'site', 'siteKey']))

  const modalTitle = (
    <span className="has-text-white has-text-weight-bold">
      {t('ATTENTION')}
    </span>
  )

  const modalContent = (
    <div className="has-text-centered is-flex flex-column">
      <span className="has-text-white mb-10">{t('ERROR_CONFIGURATION')}</span>
      <button
        className="button half-button-padding is-primary"
        onClick={() => toggleModal()}
      >
        {t('CONTINUE')}
      </button>
    </div>
  )

  const { modal, toggleModal } = useModal(modalContent, modalTitle, false)

  const validateConfig = configObject => {
    for (const value of Object.values(configObject)) {
      if (value == null) {
        return false
      }
    }
    return true
  }

  const submitConfig = () => {
    try {
      const configObject = {
        gridProfile: selectedOptions.profile.id,
        exportLimit: selectedOptions.exportLimit,
        gridVoltage: selectedOptions.gridVoltage,
        lazyGridProfile: selectedOptions.lazyGridProfile,
        prodMeter: meter.productionCT,
        consMeter: meter.consumptionCT,
        siteKey,
        devices: found
      }
      if (validateConfig(configObject)) {
        applyMeterConfig(found, meter, dispatch, siteKey)
        dispatch(SUBMIT_CONFIG(configObject))
        history.push(paths.PROTECTED.SAVING_CONFIGURATION.path)
      }
      toggleModal()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="fill-parent is-flex tile is-vertical has-text-centered system-config pl-10 pr-10">
      {modal}
      <span className="is-uppercase has-text-weight-bold mb-20">
        {t('SYSTEM_CONFIGURATION')}
      </span>
      <div className="mb-10">
        <InterfacesWidget />
      </div>
      <GridBehaviorWidget />
      <MetersWidget />
      <StorageWidget />
      <NetworkWidget />
      <RSEWidget />
      <div className="submit-config">
        <button
          onClick={submitConfig}
          className="button is-primary is-uppercase"
        >
          {t('SUBMIT_CONFIG')}
        </button>
      </div>
    </div>
  )
}
export default SystemConfiguration
