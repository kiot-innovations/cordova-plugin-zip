import useModal from 'hooks/useModal'
import { compose, endsWith, isEmpty, not, path } from 'ramda'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import paths from 'routes/paths'
import { useI18n } from 'shared/i18n'
import { UPDATE_DEVICES_LIST } from 'state/actions/devices'
import { SUBMIT_CONFIG } from 'state/actions/systemConfiguration'
import GridBehaviorWidget from './GridBehaviorWidget'

import InterfacesWidget from './InterfacesWidget'
import MetersWidget from './MetersWidget'
import NetworkWidget from './NetworkWidget'
import RSEWidget from './RSEWidget'
import StorageWidget from './StorageWidget'

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

  const { selectedOptions } = useSelector(
    state => state.systemConfiguration.gridBehavior
  )

  const { meter } = useSelector(state => state.systemConfiguration)
  const { found } = useSelector(state => state.devices)

  const siteKey = useSelector(path(['site', 'site', 'siteKey']))
  const hasStorage = useSelector(
    compose(not, isEmpty, path(['systemConfiguration', 'storage', 'data']))
  )
  const modalTitle = (
    <span className="has-text-white has-text-weight-bold">
      {t('ATTENTION')}
    </span>
  )

  const modalContent = (
    <div className="has-text-centered is-flex flex-column">
      <span className="has-text-white mb-10">{t('ERROR_CONFIGURATION')}</span>
      <button
        className="button half-button-padding is-primary is-uppercase"
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
      const metaData = createMeterConfig(found, meter, dispatch, siteKey)
      const configObject = {
        metaData,
        gridProfile: selectedOptions.profile.id,
        lazyGridProfile: selectedOptions.lazyGridProfile,
        exportLimit: selectedOptions.exportLimit,
        gridVoltage: selectedOptions.gridVoltage
      }
      if (validateConfig(configObject)) {
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
      <div className="mb-15">
        <InterfacesWidget />
      </div>
      <NetworkWidget />
      <GridBehaviorWidget />
      <MetersWidget />
      {hasStorage && <StorageWidget />}
      <RSEWidget />
      <div className="submit-config">
        <button
          onClick={() => history.push(paths.PROTECTED.PANEL_LAYOUT_TOOL.path)}
          className="button is-secondary mb-10"
        >
          {t('PLT_LINK')}
        </button>

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
