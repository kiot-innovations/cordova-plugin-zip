import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useI18n } from 'shared/i18n'
import SelectField from 'components/SelectField'
import { RESET_DISCOVERY } from 'state/actions/devices'
import { START_DISCOVERY_INIT } from 'state/actions/pvs'
import { discoveryTypes } from 'state/reducers/devices'

import paths from 'routes/paths'

import './LegacyDiscoverySelector.scss'

function LegacyDiscoverySelector() {
  const t = useI18n()
  const history = useHistory()
  const dispatch = useDispatch()

  const [selectedDiscovery, setSelectedDiscovery] = useState(
    discoveryTypes.ONLYMI
  )

  const handleChange = value => {
    setSelectedDiscovery(value.value)
  }

  const discoveryOptions = [
    { label: t('EQUINOX_AC_DEVICES'), value: discoveryTypes.ONLYMI },
    { label: t('EVERYTHING'), value: discoveryTypes.LEGACY }
  ]

  const startDiscovery = () => {
    dispatch(RESET_DISCOVERY())
    if (selectedDiscovery === discoveryTypes.ONLYMI)
      dispatch(
        START_DISCOVERY_INIT({
          MIType: 'ENPH',
          Device: 'allplusmime',
          Interfaces: 'mime',
          KeepDevices: '1',
          type: discoveryTypes.ONLYMI
        })
      )
    else
      dispatch(
        START_DISCOVERY_INIT({
          Device: 'allplusmime',
          KeepDevices: '0',
          type: discoveryTypes.LEGACY
        })
      )

    history.push(paths.PROTECTED.LEGACY_DISCOVERY.path)
  }

  return (
    <div className="legacy-discovery-selector has-text-white pl-15 pr-15">
      <div className="page-header">
        <div onClick={history.goBack}>
          <span className="sp-chevron-left is-size-4 has-text-primary" />
        </div>
        <div className="page-title has-text-centered has-text-weight-bold">
          {t('LEGACY_DISCOVERY')}
        </div>
        <div />
      </div>
      <div className="page-content">
        <div className="settings-title mb-10 has-text-weight-bold">
          <span>{t('DISCOVERY_SETTINGS')}</span>
        </div>
        <div className="settings-component pb-20">
          <div className="settings-item mb-5">
            <span>{t('DISCOVERY_SETTINGS_DESCRIPTION')}</span>
          </div>
          <div className="field">
            <SelectField
              isSearchable={false}
              onSelect={handleChange}
              defaultValue={discoveryOptions[0]}
              options={discoveryOptions}
            />
          </div>
        </div>
      </div>
      <div className="page-footer has-text-centered">
        <button onClick={startDiscovery} className="button is-primary">
          {t('START_DISCOVERY')}
        </button>
      </div>
    </div>
  )
}

export default LegacyDiscoverySelector
