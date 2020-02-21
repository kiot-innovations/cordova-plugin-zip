import React, { useState } from 'react'
import { compose, prop } from 'ramda'
import { useI18n } from 'shared/i18n'
import { either } from 'shared/utils'

import Collapsible from 'components/Collapsible'
import SelectField from 'components/SelectField'

const RSE = <span className="sp-power file level mr-15 is-size-4" />

function RSEWidget() {
  const t = useI18n()

  const [rse, setRSE] = useState(null)

  const RSES = [
    { label: t('ON'), value: true },
    { label: t('OFF'), value: false }
  ]

  return (
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
                  options={RSES}
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
  )
}
export default RSEWidget
