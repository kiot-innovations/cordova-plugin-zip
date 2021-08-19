import React from 'react'

import Template from './StringInvertersTemplate'

import useRetryStringInverterDiscovery from 'hooks/useRetryLegacyDiscovery'
import { useI18n } from 'shared/i18n'
import './noInverters.scss'

/**
 * The NoStringInverters page
 * @returns {JSX.Element}
 * @constructor
 */
const NoStringInverters = ({ isFetching }) => {
  const discoverDevices = useRetryStringInverterDiscovery()
  const t = useI18n()
  return (
    <Template>
      <div className="string-inverters tile is-flex flex-column">
        <span className="sp-inverter has-text-white is-size-1 mt-20 mb-20" />
        <p className="mb-20 has-text-white mt-10 is-size-4">
          {t('NO_OTHER_DEVICES')}
        </p>
        <button
          className="is-primary button discover"
          onClick={discoverDevices}
          disabled={isFetching}
        >
          {t(isFetching ? 'DISCOVERY_STARTING' : 'RUN_DISCOVERY')}
        </button>
      </div>
    </Template>
  )
}

export default NoStringInverters
