import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { compose, path, prop, isEmpty } from 'ramda'
import { useI18n } from 'shared/i18n'
import { buildAPsItems, either, buildAPItem } from 'shared/utils'
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
    isConnecting,
    connectedToAP,
    selectedAP,
    isConnected,
    errorFetching,
    errorConnecting
  } = useSelector(path(['systemConfiguration', 'network']))

  const [password, setPassword] = useState('')

  useEffect(() => {
    dispatch(GET_NETWORK_APS_INIT())
  }, [dispatch])

  const [showPassword, setShowPassword] = useState(false)

  const disallowConnecting =
    isFetching ||
    isConnecting ||
    !selectedAP.ssid ||
    !password ||
    selectedAP.ssid === path(['ap', 'ssid'], connectedToAP)

  const disableInputs = isFetching || errorFetching

  const handleCheckbox = () => {
    setShowPassword(!showPassword)
  }

  const networkOptions = buildAPsItems(aps)
  const placeholder = isFetching ? t('AP_DD_FETCHING') : t('SELECT_NETWORK')

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
                    disabled={disableInputs}
                    isSearchable={true}
                    onSelect={compose(dispatch, SET_SELECTED_AP, prop('ap'))}
                    value={buildAPItem(selectedAP)}
                    placeholder={placeholder}
                    options={networkOptions}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="field is-horizontal">
            <div className="field-label">
              <label htmlFor="siteName" className="label has-text-white">
                {t('PASSWORD')}
              </label>
            </div>
            <div className="field-body">
              <div className="field">
                <div className="control">
                  <input
                    disabled={disableInputs}
                    className="input"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="********"
                    onChange={compose(setPassword, path(['target', 'value']))}
                    value={password}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="field is-flex mb-15 level-right">
            <div>
              <label
                htmlFor="showPassword"
                className="label has-text-white is-small"
              >
                {t('SHOW_PASSWORD')}
              </label>
            </div>
            <div className="control">
              <input
                type="checkbox"
                id="showPassword"
                onChange={handleCheckbox}
                className="checkbox is-small ml-5 mr-5"
                checked={showPassword}
              />
            </div>
          </div>

          {either(
            isConnected &&
              !errorFetching &&
              !errorConnecting &&
              !isFetching &&
              !isEmpty(connectedToAP.label),
            <div className="message success">
              {t('AP_CONNECTION_SUCCESS', connectedToAP.label)}
            </div>
          )}

          {either(
            isFetching,
            <div className="message success">{t('AP_FETCHING')}</div>
          )}

          {either(
            isConnecting,
            <div className="message success">
              {t('AP_CONNECTING', selectedAP.ssid)}
            </div>
          )}

          {either(
            errorFetching && !isFetching,
            <div className="block">
              <div className="message error">
                {t('AP_FETCHING_ERROR')}
                <button
                  className="button has-text-primary is-uppercase is-text pl-0"
                  onClick={() => dispatch(GET_NETWORK_APS_INIT())}
                >
                  {t('RETRY_CLICK')}
                </button>
              </div>
            </div>
          )}

          {either(
            errorConnecting && !isFetching,
            <div className="message error">
              {t('AP_CONNECTION_ERROR', selectedAP.ssid)}
            </div>
          )}

          <div className="field is-grouped is-grouped-centered">
            {either(
              hideWPSButton,
              null,
              <p className="control">
                <button
                  className="button is-primary is-uppercase is-outlined"
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
