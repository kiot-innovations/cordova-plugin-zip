import React from 'react'
import { useI18n } from 'shared/i18n'

import Collapsible from 'components/Collapsible'
import SelectField from 'components/SelectField'

import './SystemConfiguration.scss'

const GBI = <span className="sp-grid file level mr-15 is-size-4" />
const MCI = <span className="sp-meter file level mr-15 is-size-4" />
const STI = <span className="sp-battery file level mr-15 is-size-4" />
const NWI = <span className="sp-wifi file level mr-15 is-size-4" />

function SystemConfiguration() {
  const t = useI18n()
  return (
    <div className="fill-parent is-flex tile is-vertical has-text-centered system-config pl-10 pr-10">
      <span className="is-uppercase has-text-weight-bold mb-20">
        {t('SYSTEM_CONFIGURATION')}
      </span>

      <div className="pb-15">
        <Collapsible title={t('GRID_BEHAVIOR')} icon={GBI} expanded>
          <div className="field is-horizontal">
            <div className="field-label">
              <label htmlFor="siteName" className="label has-text-white">
                {t('GRID_PROFILE')}
              </label>
            </div>
            <div className="field-body">
              <div className="field">
                <div className="control">
                  <SelectField
                    isSearchable={false}
                    useDefaultDropDown
                    options={[{ label: 'Option 1', value: 'Option 1' }]}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="field is-horizontal mb-20">
            <div className="field-label">
              <label htmlFor="siteName" className="label has-text-white">
                {t('CUSTOMER_SELF_SUPPLY')}
              </label>
            </div>
            <div className="field-body">
              <div className="field">
                <div className="control">
                  <SelectField
                    isSearchable={false}
                    useDefaultDropDown
                    options={[{ label: 'Yes', value: true }]}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="field is-horizontal mb-15">
            <div className="field-label">
              <label htmlFor="siteName" className="label has-text-white">
                {t('GRID_VOLTAJE')}
              </label>
            </div>
            <div className="field-body">
              <div className="field">
                <div className="control">
                  <SelectField
                    isSearchable={false}
                    useDefaultDropDown
                    options={[{ label: 'Grid Voltaje', value: '208V' }]}
                    defaultValue={{ label: 'Grid Voltaje', value: '208V' }}
                    value="208V"
                  />
                </div>
              </div>
            </div>
          </div>
        </Collapsible>
      </div>

      <div className="pb-15">
        <Collapsible title={t('METER_CT')} icon={MCI}>
          <div className="field is-horizontal mb-15">
            <div className="field-label">
              <label htmlFor="siteName" className="label has-text-white">
                {t('CONSUMPTION_CT')}
              </label>
            </div>
            <div className="field-body">
              <div className="field">
                <div className="control">
                  <SelectField
                    isSearchable={false}
                    useDefaultDropDown
                    options={[{ label: 'Grid Voltaje', value: '208V' }]}
                    defaultValue={{ label: 'Line Side', value: 'lineSide' }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="field is-horizontal mb-15">
            <div className="field-label">
              <label htmlFor="siteName" className="label has-text-white">
                {t('RATED_CURRENT')}
              </label>
            </div>
            <div className="field-body">
              <div className="field">
                <div className="control">
                  <SelectField
                    isSearchable={false}
                    useDefaultDropDown
                    options={[{ label: '100', value: '100' }]}
                    defaultValue={{ label: '100', value: '100' }}
                  />
                  <p className="control">amps</p>
                </div>
              </div>
            </div>
          </div>

          <div className="field is-horizontal mb-15">
            <div className="field-label">
              <label htmlFor="siteName" className="label has-text-white">
                {t('PRODUCTION_CT')}
              </label>
            </div>
            <div className="field-body">
              <div className="field">
                <div className="control">
                  <SelectField
                    isSearchable={false}
                    useDefaultDropDown
                    options={[{ label: 'Used', value: 'used' }]}
                    defaultValue={{ label: 'Used', value: 'no' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Collapsible>
      </div>

      <div className="pb-15">
        <Collapsible title={t('STORAGE')} icon={STI} />
      </div>

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
                      useDefaultDropDown
                      placeholder={t('SELECT_NETWORK')}
                      options={[
                        { label: 'PVS1', value: 'pvs1' },
                        { label: 'PVS2', value: 'pvs2' }
                      ]}
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
                <button className="button is-light is-uppercase">
                  {t('CONNECT')}
                </button>
              </p>
            </div>
          </form>
        </Collapsible>
      </div>
    </div>
  )
}
export default SystemConfiguration
