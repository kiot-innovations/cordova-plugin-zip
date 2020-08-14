import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useI18n } from 'shared/i18n'
import { useHistory } from 'react-router-dom'
import { Loader } from 'components/Loader'
import HomeownerAccountCreation from 'components/HomeownerAccountCreation'
import { isEmpty, test, pathOr } from 'ramda'
import { either } from 'shared/utils'
import { SUBMIT_CLEAR } from 'state/actions/systemConfiguration'
import { STOP_NETWORK_POLLING } from 'state/actions/network'
import paths from 'routes/paths'
import './SavingConfiguration.scss'
import { useSelector } from 'react-redux'
import PanelLayoutToolSavingStatus from './PanelLayoutToolSavingStatus'

const SavingConfiguration = () => {
  const t = useI18n()
  const history = useHistory()
  const dispatch = useDispatch()
  const [showHomeownerCreation, setShowHomeownerCreation] = useState(false)
  const { submitting, commissioned, error } = useSelector(
    state => state.systemConfiguration.submit
  )

  const commissioningPvs = useSelector(pathOr('', ['pvs', 'serialNumber']))

  const errorMap = e =>
    test(/database|table|foreign/gi, e) ? t('DATABASE_ERROR') : e

  const goToChangeAddress = () => {
    dispatch(STOP_NETWORK_POLLING())
    history.push(paths.PROTECTED.ROOT.path)
  }

  const goToConfig = () => {
    dispatch(SUBMIT_CLEAR())
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
            <div className="success status-message">
              <span className="has-text-white has-text-weight-bold">
                {t('SAVED_CONFIGURATION')}
              </span>
              <PanelLayoutToolSavingStatus />
              <button
                onClick={goToChangeAddress}
                className="button is-secondary is-uppercase"
              >
                {t('CONFIG_NEW_SITE')}
              </button>
              {either(
                !isEmpty(commissioningPvs),
                <button
                  onClick={() => setShowHomeownerCreation(true)}
                  className="button is-secondary is-uppercase"
                >
                  {t('CREATE_HOMEOWNER_ACCOUNT')}
                </button>
              )}
              <button
                onClick={goToData}
                className="button is-primary is-uppercase"
              >
                {t('DONE')}
              </button>
              {either(
                !isEmpty(commissioningPvs),
                <HomeownerAccountCreation
                  open={showHomeownerCreation}
                  onChange={() =>
                    setShowHomeownerCreation(!showHomeownerCreation)
                  }
                  pvs={commissioningPvs}
                />
              )}
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
              <div className="error-message mt-5 mb-5">
                <span>{errorMap(error)}</span>
              </div>
              <div className="has-text-centered">
                <button
                  onClick={goToConfig}
                  className="button is-primary is-uppercase"
                >
                  {t('RETRY')}
                </button>
              </div>
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
