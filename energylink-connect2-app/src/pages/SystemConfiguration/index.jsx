import React, { useState } from 'react'
import { prop, compose } from 'ramda'
import { useI18n } from 'shared/i18n'
import { either } from 'shared/utils'

import Collapsible from 'components/Collapsible'
import SelectField from 'components/SelectField'
import NetworkWidget from './NetworkWidget'
import './SystemConfiguration.scss'

const GBI = <span className="sp-grid file level mr-15 is-size-4" />
const MCI = <span className="sp-meter file level mr-15 is-size-4" />
const STI = <span className="sp-battery file level mr-15 is-size-4" />
const RSE = <span className="sp-info file level mr-15 is-size-4" />

function SystemConfiguration() {
  const t = useI18n()
  const [rse, setRSE] = useState(null)
  return (
    <div className="fill-parent is-flex tile is-vertical has-text-centered system-config">
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
                {t('GRID_VOLTAGE')}
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
        <Collapsible title={t('STORAGE')} icon={STI}>
          <section className="box is-flex space-around has-background-black has-text-grey pl-10 pr-10">
            <article>
              <h6 className="is-size-5 has-text-white">4 batteries</h6>
              <ul>
                <li>30849</li>
                <li>30849</li>
                <li>30849</li>
                <li>30849</li>
              </ul>
            </article>

            <article>
              <h6 className="is-size-5 has-text-white">Inverter</h6>
              <ul>
                <li>00001B3E9C74</li>
              </ul>

              <h6 className="is-size-5 has-text-white mt-20">
                Inverter Gateway
              </h6>
              <ul>
                <li>Installed</li>
              </ul>
            </article>
          </section>

          <section className="box is-flex space-around has-background-black has-text-grey pl-10 pr-10">
            <article>
              <h6 className="is-size-5 has-text-white">2 batteries</h6>
              <ul>
                <li>30849</li>
                <li>30849</li>
              </ul>
            </article>

            <article>
              <h6 className="is-size-5 has-text-white">Inverter</h6>
              <ul>
                <li>00001B3E9C74</li>
              </ul>
            </article>
          </section>
        </Collapsible>
      </div>

      <NetworkWidget />

      <div className="pb-15">
        <Collapsible title={t('RSE')} icon={RSE}>
          <div className="field is-horizontal mb-15">
            <div className="field-label">
              <label htmlFor="siteName" className="label has-text-white">
                {t('REMOTE_SYSTEM_ENERGYZE')}
              </label>
            </div>
            <div className="field-body">
              <div className="field">
                <div className="control">
                  <SelectField
                    isSearchable={false}
                    useDefaultDropDown
                    options={[
                      { label: t('ON'), value: true },
                      { label: t('OFF'), value: false }
                    ]}
                    defaultValue={{ label: t('OFF'), value: false }}
                    onSelect={compose(setRSE, prop('value'))}
                  />
                </div>
              </div>
            </div>
          </div>

          {either(
            rse,

            <article>
              <p className="text-center">{t('RSE_ON_SYSTEM')}</p>
              <ul>
                <li>{t('RSE_ON_1')}</li>
                <li>{t('RSE_ON_2')}</li>
              </ul>

              <p className="text-center mt-10">{t('RSE_ON_INVERTERS')}</p>
              <ul>
                <li>{t('RSE_ON_3')}</li>
                <li>{t('RSE_ON_4')}</li>
              </ul>
            </article>,

            <p className="text-center">{t('RSE_OFF')}</p>
          )}

          <div className="is-flex mt-15">
            <button className="button is-primary auto" disabled={rse === null}>
              {t('APPLY')}
            </button>
          </div>
        </Collapsible>
      </div>
    </div>
  )
}
export default SystemConfiguration
