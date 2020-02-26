import React from 'react'
import { useI18n } from 'shared/i18n'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { SUBMIT_CONFIG } from 'state/actions/systemConfiguration'
import useModal from 'hooks/useModal'
import NetworkWidget from './NetworkWidget'
import MetersWidget from './MetersWidget'
import GridBehaviorWidget from './GridBehaviorWidget'
import StorageWidget from './StorageWidget'
import RSEWidget from './RSEWidget'
import InterfacesWidget from './InterfacesWidget'
import paths from 'routes/paths'
import './SystemConfiguration.scss'
import { path } from 'ramda'

function SystemConfiguration({ animationState }) {
  const t = useI18n()
  const dispatch = useDispatch()
  const history = useHistory()

  const { selectedOptions } = useSelector(
    state => state.systemConfiguration.gridBehavior
  )

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

  const { modal, toggleModal } = useModal(
    animationState,
    modalContent,
    modalTitle,
    false
  )

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
        siteKey
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
      <div className="mb-10">
        <InterfacesWidget animationState={animationState} />
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
