import React, { useEffect } from 'react'
import { useI18n } from 'shared/i18n'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { SUBMIT_CONFIG } from '../../state/actions/systemConfiguration'
import paths from 'routes/paths'
import NetworkWidget from './NetworkWidget'
import MetersWidget from './MetersWidget'
import GridBehaviorWidget from './GridBehaviorWidget'
import StorageWidget from './StorageWidget'
import RSEWidget from './RSEWidget'
import './SystemConfiguration.scss'

function SystemConfiguration() {
  const t = useI18n()
  const dispatch = useDispatch()
  const history = useHistory()

  const { selectedOptions } = useSelector(
    state => state.systemConfiguration.gridBehavior
  )

  const { submitting, submitted } = useSelector(
    state => state.systemConfiguration.submit
  )

  useEffect(() => {
    if (submitted) {
      history.push(paths.PROTECTED.INSTALL_SUCCESS.path)
    }
  })

  const validateConfig = configObject => {
    for (let value of Object.values(configObject)) {
      if (value === undefined) {
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
        gridVoltage: selectedOptions.gridVoltage
      }
      if (validateConfig(configObject)) {
        dispatch(SUBMIT_CONFIG(configObject))
      } else {
        alert('Invalid object')
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="fill-parent is-flex tile is-vertical has-text-centered system-config pl-10 pr-10">
      <span className="is-uppercase has-text-weight-bold mb-20">
        {t('SYSTEM_CONFIGURATION')}
      </span>

      {submitting ? (
        <div>
          <div className="custom-loader">
            <div className="loader-inner line-scale-pulse-out-rapid">
              <div /> <div /> <div /> <div /> <div />
            </div>
          </div>
          <span className="hint-text">{t('SUBMITTING_CONFIG')}</span>
        </div>
      ) : (
        ''
      )}
      <GridBehaviorWidget />
      <MetersWidget />
      <StorageWidget />
      <NetworkWidget />
      <RSEWidget />
      <div className="submit-config">
        <button
          onClick={submitConfig}
          className="button is-primary is-uppercase"
          disabled={submitting}
        >
          {t(submitting ? 'SUBMITTING...' : 'SUBMIT_CONFIG')}
        </button>
      </div>
    </div>
  )
}
export default SystemConfiguration
