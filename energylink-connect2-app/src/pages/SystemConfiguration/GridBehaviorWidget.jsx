import React, { useEffect, useState } from 'react'
import { useI18n } from 'shared/i18n'
import { useDispatch, useSelector } from 'react-redux'
import {
  FETCH_GRID_BEHAVIOR,
  SET_GRID_PROFILE,
  SET_LAZY_GRID_PROFILE,
  SET_EXPORT_LIMIT,
  SET_GRID_VOLTAGE
} from 'state/actions/systemConfiguration'
import { pathOr, length, head } from 'ramda'
import Collapsible from 'components/Collapsible'
import SelectField from 'components/SelectField'
import './SystemConfiguration.scss'

const GBI = <span className="sp-grid file level mr-15 is-size-4" />

function GridBehaviorWidget({ animationState }) {
  const t = useI18n()
  const dispatch = useDispatch()
  const { profiles, exportLimit, gridVoltage } = useSelector(
    state => state.systemConfiguration.gridBehavior
  )
  const { site } = useSelector(state => state.site)
  const [selfSupplyOptions, setSelfSupplyOptions] = useState([])
  const [hasDefaultGridProfile, setHasDefaultGridProfile] = useState(false)

  useEffect(() => {
    if (animationState === 'enter') dispatch(FETCH_GRID_BEHAVIOR())
  }, [animationState, dispatch])

  const filterProfiles =
    profiles && site
      ? profiles.filter(
          profile =>
            site.postalCode >= pathOr(0, ['zipcodes', 0, 'min'], profile) &&
            site.postalCode <= pathOr(0, ['zipcodes', 0, 'max'], profile)
        )
      : []

  let defaultGridProfile = null

  const gridProfileOptions = filterProfiles.map(profile => {
    if (length(filterProfiles) === 2 && !/^IEEE/.test(profile.name)) {
      defaultGridProfile = { label: profile.name, value: profile }
    }
    return { label: profile.name, value: profile }
  })

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
      setSelfSupplyOptions([{ label: t('NO_SELF_SUPPLY'), value: false }])
    }
  }

  if (!hasDefaultGridProfile && defaultGridProfile) {
    setGridProfile(defaultGridProfile)
    setHasDefaultGridProfile(true)
  }

  const setExportLimit = value => {
    dispatch(SET_EXPORT_LIMIT(value.value))
  }

  const setGridVoltage = value => {
    dispatch(SET_GRID_VOLTAGE(value.value))
  }

  const setLazyGridProfile = value => {
    dispatch(SET_LAZY_GRID_PROFILE(value.value))
  }

  const lazyGridProfileOptions = [
    { label: 'Yes', value: 1 },
    { label: 'No', value: 0 }
  ]

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
                  defaultValue={defaultGridProfile}
                  options={gridProfileOptions}
                  notFoundText={
                    length(gridProfileOptions) === 0
                      ? t('FETCHING_OPTIONS')
                      : null
                  }
                  onSelect={setGridProfile}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="field is-horizontal">
          <div className="field-label">
            <label htmlFor="siteName" className="label has-text-white">
              {t('LAZY_GRID_PROFILE')}
            </label>
          </div>
          <div className="field-body">
            <div className="field">
              <div className="control">
                <SelectField
                  isSearchable={false}
                  useDefaultDropDown
                  options={lazyGridProfileOptions}
                  onSelect={setLazyGridProfile}
                  defaultValue={head(lazyGridProfileOptions)}
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
                  notFoundText={
                    length(selfSupplyOptions) === 0
                      ? t('SELECT_A_GRID_PROFILE')
                      : null
                  }
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
                    { label: '208', value: 208 },
                    { label: '240', value: 240 }
                  ]}
                  defaultValue={
                    gridVoltage.grid_voltage === 240
                      ? { label: '208', value: 208 }
                      : { label: '240', value: 240 }
                  }
                  onSelect={setGridVoltage}
                />
                <p className="control">volts</p>
              </div>
            </div>
          </div>
        </div>
      </Collapsible>
    </div>
  )
}

export default GridBehaviorWidget
