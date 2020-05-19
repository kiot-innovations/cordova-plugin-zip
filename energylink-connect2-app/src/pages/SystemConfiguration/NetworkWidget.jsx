import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { compose, path, prop, isEmpty } from 'ramda'
import { useI18n } from 'shared/i18n'
import { buildAPsItems, either } from 'shared/utils'
import {
  CONNECT_NETWORK_AP_INIT,
  GET_NETWORK_APS_INIT,
  SET_SELECTED_AP
} from 'state/actions/systemConfiguration'

import Collapsible from 'components/Collapsible'
import SelectField from 'components/SelectField'

const NWI = <span className="sp-wifi file level mr-15 is-size-4" />

function NetworkWidget({ hideWPSButton, expanded }) {
  const t = useI18n()
  const dispatch = useDispatch()

  const {
    aps,
    isFetching,
    connectedToAP,
    selectedAP,
    isConnected,
    error
  } = useSelector(path(['systemConfiguration', 'network']))

  const [password, setPassword] = useState('')

  useEffect(() => {
    dispatch(GET_NETWORK_APS_INIT())
  }, [dispatch])

  const disallowConnecting =
    isFetching ||
    !selectedAP.ssid ||
    !password ||
    selectedAP.ssid === path(['ap', 'ssid'], connectedToAP)

  const networkOptions = buildAPsItems(aps)

  return (
    <div className="pb-15">
      <Collapsible title={t('NETWORK')} icon={NWI} expanded={expanded}>
        <form>
          <div className="field is-horizontal mb-15">
            <div className="field-label">
              <label htmlFor="siteName" className="label has-text-white">
                {t('NETWORK')}
              </label>
            </div>
            <div className="field-body">
              <div className="field">
                <div className="control">
                  <SelectField
                    disabled={isFetching}
                    isSearchable={true}
                    onSelect={compose(dispatch, SET_SELECTED_AP, prop('ap'))}
                    defaultInputValue={connectedToAP.value}
                    placeholder={t('SELECT_NETWORK')}
                    options={networkOptions}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="field is-horizontal mb-15">
            <div className="field-label">
              <label htmlFor="siteName" className="label has-text-white">
                {t('PASSWORD')}
              </label>
            </div>
            <div className="field-body">
              <div className="field">
                <div className="control">
                  <input
                    disabled={isFetching}
                    className="input"
                    type="password"
                    placeholder="********"
                    onChange={compose(setPassword, path(['target', 'value']))}
                    value={password}
                  />
                </div>
              </div>
            </div>
          </div>

          {either(
            isConnected &&
              !error &&
              !isFetching &&
              !isEmpty(connectedToAP.label),
            <div className="message success">
              {t('AP_CONNECTION_SUCCESS', connectedToAP.label)}
            </div>
          )}

          {either(
            error && !isFetching,
            <div className="message error">{t('AP_CONNECTION_ERROR')}</div>
          )}

          <div className="field is-grouped is-grouped-centered">
            {either(
              hideWPSButton,
              null,
              <p className="control">
                <button
                  className="button is-primary is-outlined"
                  disabled={disallowConnecting}
                  onClick={() =>
                    dispatch(
                      CONNECT_NETWORK_AP_INIT({
                        ssid: selectedAP.ssid,
                        password,
                        mode: 'wps'
                      })
                    )
                  }
                >
                  {t('USE_WPS')}
                </button>
              </p>
            )}
            <p className="control">
              <button
                className="button is-primary is-uppercase"
                disabled={disallowConnecting}
                onClick={() =>
                  dispatch(
                    CONNECT_NETWORK_AP_INIT({
                      ssid: selectedAP.ssid,
                      password,
                      mode: 'psk'
                    })
                  )
                }
              >
                {isFetching ? t('LOADING') : t('CONNECT')}
              </button>
            </p>
          </div>
        </form>
      </Collapsible>
    </div>
  )
}
export default NetworkWidget
