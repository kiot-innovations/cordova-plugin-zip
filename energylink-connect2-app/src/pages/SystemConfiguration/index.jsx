import React, { useEffect } from 'react'
import { useI18n } from 'shared/i18n'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { SUBMIT_CONFIG } from '../../state/actions/systemConfiguration'
import paths from 'routes/paths'
import useModal from 'hooks/useModal'
import NetworkWidget from './NetworkWidget'
import MetersWidget from './MetersWidget'
import GridBehaviorWidget from './GridBehaviorWidget'
import StorageWidget from './StorageWidget'
import RSEWidget from './RSEWidget'
import './SystemConfiguration.scss'

function SystemConfiguration({ animationState }) {
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
    if (submitted && animationState !== 'leave') {
      history.push(paths.PROTECTED.INSTALL_SUCCESS.path)
    }
  })

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
        toggleModal()
      }
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
          {t(submitting ? 'SUBMITTING' : 'SUBMIT_CONFIG')}
        </button>
      </div>
    </div>
  )
}
export default SystemConfiguration
