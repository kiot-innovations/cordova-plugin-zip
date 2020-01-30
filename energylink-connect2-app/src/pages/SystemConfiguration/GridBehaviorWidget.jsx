import React, { useEffect, useState } from 'react'
import { useI18n } from 'shared/i18n'
import { useDispatch, useSelector } from 'react-redux'
import {
  FETCH_GRID_BEHAVIOR,
  SET_GRID_PROFILE,
  SET_EXPORT_LIMIT,
  SET_GRID_VOLTAGE
} from 'state/actions/systemConfiguration'
import { pathOr, length } from 'ramda'
import Collapsible from 'components/Collapsible'
import SelectField from 'components/SelectField'
import './SystemConfiguration.scss'

const GBI = <span className="sp-grid file level mr-15 is-size-4" />

function GridBehaviorWidget() {
  const t = useI18n()
  const dispatch = useDispatch()
  const { profiles, exportLimit, gridVoltage } = useSelector(
    state => state.systemConfiguration.gridBehavior
  )
  const { site } = useSelector(state => state.site)
  const [selfSupplyOptions, setSelfSupplyOptions] = useState([
    { label: 'Please select a grid profile', value: false }
  ])

  useEffect(() => {
    dispatch(FETCH_GRID_BEHAVIOR())
  }, [dispatch])

  const filterProfiles =
    profiles && site
      ? profiles.filter(
          profile =>
            site.postalCode >= pathOr(0, ['zipcodes', 0, 'min'], profile) &&
            site.postalCode <= pathOr(0, ['zipcodes', 0, 'max'], profile)
        )
      : []

  const gridProfileOptions =
    length(filterProfiles) > 0
      ? filterProfiles.map(profile => {
          return { label: profile.name, value: profile }
        })
      : [{ label: 'Fetching Options...', value: 'Option 1' }]

  const setGridProfile = value => {
    dispatch(SET_GRID_PROFILE(value.value))
    const selfSupplyAvailability = pathOr(false, ['value', 'selfsupply'], value)
    if (selfSupplyAvailability) {
      if (exportLimit === -1) {
        dispatch(SET_EXPORT_LIMIT(-1))
        setSelfSupplyOptions([{ label: 'No', value: -1 }])
      } else {
        dispatch(SET_EXPORT_LIMIT(0))
        setSelfSupplyOptions([
          { label: 'Yes', value: 0 },
          { label: 'No', value: -1 }
        ])
      }
    } else {
      dispatch(SET_EXPORT_LIMIT(false))
      setSelfSupplyOptions([{ label: 'No Self Supply', value: false }])
    }
  }

  const setExportLimit = value => {
    dispatch(SET_EXPORT_LIMIT(value.value))
  }

  const setGridVoltage = value => {
    dispatch(SET_GRID_VOLTAGE(value.value))
  }

  return (
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
                  options={gridProfileOptions}
                  onSelect={setGridProfile}
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
                  options={selfSupplyOptions}
                  onSelect={setExportLimit}
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
                  options={[
                    { label: '208v', value: 208 },
                    { label: '240v', value: 240 }
                  ]}
                  defaultValue={
                    gridVoltage.grid_voltage === 240
                      ? { label: '208v', value: 208 }
                      : { label: '240v', value: 240 }
                  }
                  onSelect={setGridVoltage}
                />
              </div>
            </div>
          </div>
        </div>
      </Collapsible>
    </div>
  )
}

export default GridBehaviorWidget
