import React, { useState } from 'react'
import { prop, compose } from 'ramda'
import { useI18n } from 'shared/i18n'
import { either } from 'shared/utils'
import Collapsible from 'components/Collapsible'
import SelectField from 'components/SelectField'
import NetworkWidget from './NetworkWidget'
import MetersWidget from './MetersWidget'
import GridBehaviorWidget from './GridBehaviorWidget'

import './SystemConfiguration.scss'

const STI = <span className="sp-battery file level mr-15 is-size-4" />
const RSE = <span className="sp-info file level mr-15 is-size-4" />

function SystemConfiguration() {
  const t = useI18n()
  const [rse, setRSE] = useState(null)

  return (
    <div className="fill-parent is-flex tile is-vertical has-text-centered system-config pl-10 pr-10">
      <span className="is-uppercase has-text-weight-bold mb-20">
        {t('SYSTEM_CONFIGURATION')}
      </span>

      <GridBehaviorWidget />

      <MetersWidget />

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
