import React from 'react'
import { find, prop, propEq } from 'ramda'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import paths from 'routes/paths'
import { useI18n } from 'shared/i18n'
import {
  UPDATE_INVENTORY,
  UPDATE_OTHER_INVENTORY
} from 'state/actions/inventory'
import { START_DISCOVERY_INIT } from 'state/actions/pvs'
import { discoveryTypes } from 'state/reducers/devices'
import { SHOW_MODAL } from 'state/actions/modal'
import SelectField from 'components/SelectField'

import './RMAInventory.scss'

const RMAInventory = () => {
  const t = useI18n()
  const dispatch = useDispatch()
  const { bom, rma } = useSelector(state => state.inventory)
  const miValue = find(propEq('item', 'AC_MODULES'), bom)
  const storageValue = find(propEq('item', 'ESS'), bom)
  const history = useHistory()

  const essOptions = [
    { value: '0', label: t('NONE') },
    { value: '13kWh', label: t('13KWH_1INV') },
    { value: '26kWh (1 inverter)', label: t('26KWH_1INV') },
    { value: '26kWh (2 inverters)', label: t('26KWH_2INV') }
  ]

  const miOptions = [...Array(99).keys()].map(number => ({
    label: number,
    value: number
  }))

  const handleCheckbox = e => {
    e.preventDefault()
    dispatch(UPDATE_OTHER_INVENTORY(e.target.checked))
  }

  const handleChange = name => option => {
    dispatch(
      UPDATE_INVENTORY({
        name: name,
        value: option.value
      })
    )
  }

  const handleContinue = () => {
    if (prop('other', rma)) {
      dispatch(
        START_DISCOVERY_INIT({
          Device: 'allplusmime',
          type: discoveryTypes.LEGACY
        })
      )
      history.push(paths.PROTECTED.LEGACY_DISCOVERY.path)
    } else if (parseInt(miValue.value) > 0) {
      history.push(paths.PROTECTED.SCAN_LABELS.path)
    } else if (parseInt(storageValue.value) !== 0) {
      history.push(paths.PROTECTED.STORAGE_PREDISCOVERY.path)
    } else {
      dispatch(
        SHOW_MODAL({
          title: t('FIX_ERROR_TO_PROCEED'),
          body: t('RMA_SELECT_DEVICE_ERROR'),
          dismissable: true,
          withButtons: true
        })
      )
    }
  }

  const handleCancel = () => {
    history.push(paths.PROTECTED.RMA_DEVICES.path)
  }

  return (
    <div className="rma-add-devices pr-10 pl-10">
      <div className="rma-form">
        <p className="is-uppercase has-text-centered has-text-weight-bold">
          {t('RMA_ADD_DEVICES_TITLE')}
        </p>

        <div className="collapsible mt-20">
          <div className="collapsible-header">
            <div className="collapsible-title">
              <div className="has-text-weight-bold" htmlFor="MI">
                {t('MICROINVERTERS')}
              </div>
            </div>
          </div>

          <div className="field mt-10">
            <SelectField
              isSearchable={false}
              onSelect={handleChange('AC_MODULES')}
              defaultValue={find(propEq('value', miValue.value), miOptions)}
              options={miOptions}
            />
          </div>
        </div>

        <div className="collapsible mt-10">
          <div className="collapsible-header">
            <div className="collapsible-title">
              <label className="has-text-weight-bold" htmlFor="other">
                {t('SUNVAULT_STORAGE')}
              </label>
            </div>
          </div>
          <div className="field mt-10">
            <SelectField
              isSearchable={false}
              onSelect={handleChange('ESS')}
              value={find(propEq('value', storageValue.value), essOptions)}
              options={essOptions}
            />
          </div>
        </div>

        <div className="collapsible mt-10">
          <div className="collapsible-header">
            <div className="collapsible-title">
              <input
                type="checkbox"
                id="other"
                name="other"
                onChange={handleCheckbox}
                className="mr-10 checkbox-dark"
                defaultChecked={prop('other', rma)}
              />
              <label className="has-text-weight-bold" htmlFor="other">
                {t('OTHER_DEVICES')}
              </label>
            </div>
          </div>
        </div>
      </div>

      <div>
        <p className="has-text-centered mt-20 mb-20">
          {t('RMA_ADD_DEVICES_TIP')}
        </p>

        <div className="rma-buttons">
          <button
            className="button half-button-padding is-secondary is-uppercase trigger-scan mr-10"
            onClick={handleCancel}
          >
            {t('CANCEL')}
          </button>
          <button
            className="button half-button-padding is-primary is-uppercase trigger-scan"
            onClick={handleContinue}
          >
            {t('CONTINUE')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default RMAInventory
