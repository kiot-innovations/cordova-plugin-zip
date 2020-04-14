import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { path, compose, prop, isEmpty } from 'ramda'
import { useI18n } from 'shared/i18n'

import Collapsible from 'components/Collapsible'
import SelectField from 'components/SelectField'

import {
  GET_NETWORK_APS_INIT,
  CONNECT_NETWORK_AP_INIT,
  SET_SELECTED_AP
} from 'state/actions/systemConfiguration'
import { either, buildAPsItems } from 'shared/utils'

const NWI = <span className="sp-wifi file level mr-15 is-size-4" />

function NetworkWidget({ animationState }) {
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
    if (animationState === 'enter') dispatch(GET_NETWORK_APS_INIT())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const disallowConnecting =
    isFetching || selectedAP.ssid === path(['ap', 'ssid'], connectedToAP)

  return (
    <div className="pb-15">
      <Collapsible title={t('NETWORK')} icon={NWI}>
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
                    defaultValue={connectedToAP}
                    placeholder={t('SELECT_NETWORK')}
                    options={buildAPsItems(aps)}
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
