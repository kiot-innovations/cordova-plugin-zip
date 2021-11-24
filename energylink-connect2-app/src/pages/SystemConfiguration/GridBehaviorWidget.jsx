import {
  always,
  compose,
  cond,
  flip,
  head,
  includes,
  isEmpty,
  length,
  pathOr,
  pipe,
  prop,
  T,
  when
} from 'ramda'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Collapsible from 'components/Collapsible'
import SelectField from 'components/SelectField'
import { useFeatureFlag } from 'shared/featureFlags'
import { useI18n } from 'shared/i18n'
import { either, findByPathValue } from 'shared/utils'
import {
  FETCH_GRID_BEHAVIOR,
  SET_GRID_PROFILE,
  SET_EXPORT_LIMIT,
  SET_GRID_VOLTAGE
} from 'state/actions/systemConfiguration'
import { fwupStatus } from 'state/reducers/firmware-update'
import './SystemConfiguration.scss'

const GBI = <span className="sp-grid file level mr-15 is-size-4" />
const voltageWarning = (t, measuredVoltage = 0) => (
  <div className="voltage-warning">
    <div className="is-size-6 ml-10 mr-10 sp-hey has-text-primary" />
    <div className="is-size-6 mr-10 has-text-primary">
      {t('VOLTAGE_WARNING', measuredVoltage)}
    </div>
  </div>
)

const setDefaultGridVoltage = (dispatch, value) =>
  when(flip(includes)([208, 240]), compose(dispatch, SET_GRID_VOLTAGE))(value)

function GridBehaviorWidget() {
  const t = useI18n()
  const getExportLimitOptions = (availability, exportLimit) => {
    if (!availability) {
      return [{ label: t('NO_SELF_SUPPLY'), value: -1 }]
    }
    return exportLimit === -1
      ? [{ label: 'No', value: -1 }]
      : [
          { label: 'Yes', value: 0 },
          { label: 'No', value: -1 }
        ]
  }

  const dispatch = useDispatch()
  const {
    profiles,
    gridVoltage,
    selectedOptions,
    fetchingGridBehavior
  } = useSelector(state => state.systemConfiguration.gridBehavior)
  const { site } = useSelector(state => state.site)
  const { model } = useSelector(state => state.pvs)
  const { status } = useSelector(state => state.firmwareUpdate)

  const [selfSupplyOptions, setSelfSupplyOptions] = useState(
    getExportLimitOptions(
      pathOr(false, ['profile', 'selfsupply'], selectedOptions),
      pathOr(false, ['exportLimit'], selectedOptions)
    )
  )

  const [hasDefaultGridProfile, setHasDefaultGridProfile] = useState(false)

  const uploadingOrFetchingProfiles =
    status === fwupStatus.UPLOADING_GRID_PROFILES ||
    status === fwupStatus.UPGRADE_COMPLETE ||
    fetchingGridBehavior === true

  useEffect(() => {
    if (
      isEmpty(profiles) &&
      !uploadingOrFetchingProfiles &&
      status !== fwupStatus.ERROR_GRID_PROFILE
    ) {
      dispatch(FETCH_GRID_BEHAVIOR())
    }
  }, [dispatch, profiles, uploadingOrFetchingProfiles, status])

  useEffect(() => {
    if (!prop('gridVoltage', selectedOptions)) {
      setDefaultGridVoltage(dispatch, prop('measured', gridVoltage))
    }
  }, [dispatch, gridVoltage, selectedOptions])

  const findProfileById = pipe(
    findByPathValue(profiles, ['id']),
    cond([
      [x => x, ({ id, name }) => ({ label: name, value: id })],
      [T, always(null)]
    ])
  )

  const filterProfiles = () => {
    if (profiles && site) {
      return profiles.filter(profile => {
        const postalCode = parseInt(site.postalCode, 10)
        const hasIndividualPostalCode = profile.zipcodes.includes(postalCode)
        const postalCodeIsInRange =
          postalCode >= pathOr(0, ['zipcodes', 0, 'min'], profile) &&
          postalCode <= pathOr(0, ['zipcodes', 0, 'max'], profile)
        return hasIndividualPostalCode || postalCodeIsInRange
      })
    } else {
      return []
    }
  }

  let defaultGridProfile = null
  const isIEEE = /^IEEE/
  const filteredProfiles = filterProfiles()

  const gridProfileOptions = [
    { label: t('NO_GRID_PROFILE'), value: '' },
    ...filteredProfiles.map(profile => {
      if (length(filteredProfiles) === 2 && !isIEEE.test(profile.name)) {
        defaultGridProfile = { label: profile.name, value: profile }
      }
      return { label: profile.name, value: profile }
    })
  ]

  const setGridProfile = value => {
    dispatch(SET_GRID_PROFILE(value.value))
    const selfSupplyAvailability = pathOr(false, ['value', 'selfsupply'], value)
    const options = getExportLimitOptions(selfSupplyAvailability)
    setSelfSupplyOptions(options)
    dispatch(SET_EXPORT_LIMIT(head(options).value))
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

  useEffect(() => {
    if (model === 'PVS5') {
      dispatch(SET_GRID_VOLTAGE(120))
    }
  }, [dispatch, model])

  let gridVoltageOptions = [
    { label: '208', value: 208 },
    { label: '240', value: 240 }
  ]
  let gridVoltageDefaultValue = null
  if (model === 'PVS5') {
    const gridVoltageOption = {
      label: '120 (L-N)',
      value: 120
    }
    gridVoltageOptions = [gridVoltageOption]
    gridVoltageDefaultValue = gridVoltageOption
  }

  const findVoltageByValue = findByPathValue(gridVoltageOptions, ['value'])
  const findExportLimitValue = findByPathValue(selfSupplyOptions, ['value'])

  const showVoltageWarning = gridVoltage.selected !== gridVoltage.measured

  const isInHawaii = site.st_id === 'Hawaii' || site.st_id === 'HI'
  const featureFlagIsOn = useFeatureFlag({
    page: 'system-configuration',
    name: 'enable-customer-self-supply'
  })
  return (
    <div className="pb-15">
      <Collapsible title={t('GRID_BEHAVIOR')} icon={GBI} required>
        <div className="field is-horizontal">
          <div className="field-label">
            <label htmlFor="siteName" className="label has-text-white">
              {t('GRID_PROFILE')}
              <span className="ml-5 pt-5 has-text-danger">*</span>
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
                  value={findProfileById(
                    pathOr(null, ['profile', 'id'], selectedOptions)
                  )}
                  notFoundText={
                    fetchingGridBehavior
                      ? t('FETCHING_OPTIONS')
                      : t('GRID_PROFILES_NOT_FOUND')
                  }
                  onSelect={setGridProfile}
                />
              </div>
            </div>
          </div>
        </div>

        {//Show this for PVS5 if they're in Hawaii && Show this for PVS6 if they're in Hawaii and the feature flag is on
        either(
          (model === 'PVS5' && isInHawaii) || (featureFlagIsOn && isInHawaii),
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
                    value={findExportLimitValue(
                      pathOr(null, ['exportLimit'], selectedOptions)
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="field is-horizontal mb-15">
          <div className="field-label">
            <label htmlFor="siteName" className="label has-text-white">
              {t('GRID_VOLTAGE')}
              <span className="ml-5 pt-5 has-text-danger">*</span>
            </label>
          </div>
          <div className="field-body">
            <div className="field">
              <div className="control">
                <SelectField
                  isSearchable={false}
                  useDefaultDropDown
                  disabled={gridVoltageOptions.length === 1}
                  options={gridVoltageOptions}
                  value={
                    gridVoltageDefaultValue
                      ? gridVoltageDefaultValue
                      : findVoltageByValue(selectedOptions.gridVoltage)
                  }
                  onSelect={setGridVoltage}
                />
                <p className="control">volts</p>
                {showVoltageWarning && voltageWarning(t, gridVoltage.measured)}
              </div>
            </div>
          </div>
        </div>
      </Collapsible>
    </div>
  )
}

export default GridBehaviorWidget
