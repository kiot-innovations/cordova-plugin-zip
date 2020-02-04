import React from 'react'
import { useI18n } from 'shared/i18n'
import { useSelector } from 'react-redux'
import NetworkWidget from './NetworkWidget'
import MetersWidget from './MetersWidget'
import GridBehaviorWidget from './GridBehaviorWidget'
import StorageWidget from './StorageWidget'
import RSEWidget from './RSEWidget'

import './SystemConfiguration.scss'

function SystemConfiguration() {
  const t = useI18n()
  const { selectedOptions } = useSelector(
    state => state.systemConfiguration.gridBehavior
  )
  const { isConnected } = useSelector(
    state => state.systemConfiguration.network
  )
  const { productionCT, consumptionCT, ratedCurrent } = useSelector(
    state => state.systemConfiguration.meter
  )

  const submitConfig = () => {
    try {
      const configObject = {
        gridProfile: selectedOptions.profile.id,
        exportLimit: selectedOptions.exportLimit,
        gridVoltage: selectedOptions.gridVoltage,
        productionCT: productionCT.value,
        consumptionCT,
        ratedCurrent,
        isConnected
      }
      alert(configObject)
    } catch (err) {
      alert('Please check the configuration values before submitting')
    }
  }

  return (
    <div className="fill-parent is-flex tile is-vertical has-text-centered system-config pl-10 pr-10">
      <span className="is-uppercase has-text-weight-bold mb-20">
        {t('SYSTEM_CONFIGURATION')}
      </span>

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
