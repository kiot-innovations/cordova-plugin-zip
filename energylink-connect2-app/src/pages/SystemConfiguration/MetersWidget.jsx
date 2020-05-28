import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { path, compose, prop, find, propEq } from 'ramda'
import { useI18n } from 'shared/i18n'

import Collapsible from 'components/Collapsible'
import SelectField from 'components/SelectField'

import {
  SET_PRODUCTION_CT,
  SET_RATED_CURRENT,
  SET_CONSUMPTION_CT
} from 'state/actions/systemConfiguration'

const MCI = <span className="sp-meter file level mr-15 is-size-4" />

function MetersWidget() {
  const t = useI18n()
  const dispatch = useDispatch()

  const { consumptionCT, productionCT, ratedCurrent } = useSelector(
    path(['systemConfiguration', 'meter'])
  )

  const CONSUMPTION_METER_TYPES = [
    { label: t('NOT_USED'), value: 'NOT_USED' },
    { label: t('NET_CONSUMPTION_LOADSIDE'), value: 'NET_CONSUMPTION_LOADSIDE' },
    {
      label: t('GROSS_CONSUMPTION_LINESIDE'),
      value: 'GROSS_CONSUMPTION_LINESIDE'
    }
  ]

  const PRODUCTION_METER_TYPES = [
    { label: t('NOT_USED'), value: 'NOT_USED' },
    { label: t('GROSS_PRODUCTION_SITE'), value: 'GROSS_PRODUCTION_SITE' }
  ]

  return (
    <div className="pb-15">
      <Collapsible title={t('METER_CT')} icon={MCI}>
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
                  onSelect={compose(dispatch, SET_PRODUCTION_CT, prop('value'))}
                  options={PRODUCTION_METER_TYPES}
                  defaultValue={find(
                    propEq('value', productionCT),
                    PRODUCTION_METER_TYPES
                  )}
                />
              </div>
            </div>
          </div>
        </div>

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
                  onSelect={compose(
                    dispatch,
                    SET_CONSUMPTION_CT,
                    prop('value')
                  )}
                  options={CONSUMPTION_METER_TYPES}
                  defaultValue={find(
                    propEq('value', consumptionCT),
                    CONSUMPTION_METER_TYPES
                  )}
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
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={ratedCurrent}
                  className="input has-background-dark"
                  onChange={compose(
                    dispatch,
                    SET_RATED_CURRENT,
                    parseInt,
                    path(['target', 'value'])
                  )}
                />
                <p className="control">amps</p>
              </div>
            </div>
          </div>
        </div>
      </Collapsible>
    </div>
  )
}
export default MetersWidget
