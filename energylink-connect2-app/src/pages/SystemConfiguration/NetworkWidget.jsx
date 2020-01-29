import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { path, map, compose, prop } from 'ramda'
import { useI18n } from 'shared/i18n'

import Collapsible from 'components/Collapsible'
import SelectField from 'components/SelectField'

import {
  GET_NETWORK_APS_INIT,
  SET_NETWORK_AP
} from 'state/actions/systemConfiguration'

const NWI = <span className="sp-wifi file level mr-15 is-size-4" />

const buildAPItem = ap => ({ label: ap.ssid, value: ap.ssid, ap })
const buildAPsItems = map(buildAPItem)

function NetworkWidget() {
  const t = useI18n()
  const dispatch = useDispatch()

  const { aps, isFetching, selectedAP } = useSelector(
    path(['systemConfiguration', 'network'])
  )

  useEffect(() => {
    dispatch(GET_NETWORK_APS_INIT())
  }, [dispatch])

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
                    isSearchable={false}
                    onSelect={compose(dispatch, SET_NETWORK_AP, prop('ap'))}
                    defaultValue={buildAPItem(selectedAP || {})}
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
                    className="input"
                    type="password"
                    placeholder="********"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="field is-grouped is-grouped-centered">
            <p className="control">
              <button className="button is-primary is-outlined">
                {t('USE_WPS')}
              </button>
            </p>
            <p className="control">
              <button
                className="button is-light is-uppercase"
                disabled={isFetching}
              >
                {t('CONNECT')}
              </button>
            </p>
          </div>
        </form>
      </Collapsible>
    </div>
  )
}
export default NetworkWidget
