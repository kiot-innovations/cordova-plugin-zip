import React from 'react'
import { useDispatch } from 'react-redux'
import { useI18n } from 'shared/i18n'
import { useHistory } from 'react-router-dom'
import { Loader } from 'components/Loader'
import { isEmpty } from 'ramda'
import { STOP_NETWORK_POLLING } from 'state/actions/network'
import paths from 'routes/paths'
import './SavingConfiguration.scss'
import { useSelector } from 'react-redux'

const SavingConfiguration = () => {
  const t = useI18n()
  const history = useHistory()
  const dispatch = useDispatch()
  const { submitting, commissioned, error } = useSelector(
    state => state.systemConfiguration.submit
  )

  const goToChangeAddress = () => {
    dispatch(STOP_NETWORK_POLLING())
    history.push(paths.PROTECTED.ROOT.path)
  }

  const goToConfig = () => {
    history.push(paths.PROTECTED.SYSTEM_CONFIGURATION.path)
  }

  const goToData = () => {
    history.push(paths.PROTECTED.DATA.path)
  }

  const configContent =
    commissioned && isEmpty(error)
      ? {
          title: t('CONFIG_DONE'),
          indicator: (
            <div className="pt-20 pb-20">
              <i className="sp-check has-text-white is-size-1" />
            </div>
          ),
          controls: (
            <div className="status-message">
              <span className="has-text-white has-text-weight-bold">
                {t('SAVED_CONFIGURATION')}
              </span>
              <span className="has-text-weight-bold">{t('ONE_LAST_STEP')}</span>
              <span>{t('UPDATE_LAYOUT_ELA')}</span>
              <button
                onClick={goToChangeAddress}
                className="button is-secondary"
              >
                {t('CONFIG_NEW_SITE')}
              </button>
              <button onClick={goToData} className="button is-primary">
                {t('DONE')}
              </button>
            </div>
          )
        }
      : {
          title: t('CONFIG_ERROR'),
          indicator: (
            <div className="pt-20 pb-20">
              <i className="sp-close has-text-white is-size-1" />
            </div>
          ),
          controls: (
            <div className="status-message">
              <span>{t('CONFIG_ERROR_2')}</span>
              <span>{error}</span>
              <button onClick={goToConfig} className="button is-primary">
                {t('RETRY')}
              </button>
            </div>
          )
        }

  return (
    <div className="saving-configuration has-text-centered pt-20 pr-20 pl-20">
      <span className="is-uppercase has-text-weight-bold">
        {submitting ? t('HOLD_ON') : configContent.title}
      </span>
      {submitting ? <Loader /> : configContent.indicator}

      {submitting ? (
        <div className="status-message">
          <span> {t('SAVING_CONFIGURATION')} </span>
          <span className="has-text-weight-bold">{t('DONT_CLOSE_APP')}</span>
        </div>
      ) : (
        configContent.controls
      )}
    </div>
  )
}

export default SavingConfiguration
