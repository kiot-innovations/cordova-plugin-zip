import React from 'react'
import { find, path, prop, propEq } from 'ramda'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import paths from 'routes/paths'
import { useI18n } from 'shared/i18n'
import { SAVE_INVENTORY_RMA } from 'state/actions/inventory'
import { START_DISCOVERY_INIT } from 'state/actions/pvs'
import { SHOW_MODAL } from 'state/actions/modal'
import SelectField from 'components/SelectField'

import './RMAInventory.scss'

const RMAInventory = () => {
  const t = useI18n()
  const dispatch = useDispatch()
  const rma = useSelector(path(['inventory', 'rma']))
  const history = useHistory()

  const essOptions = [
    { value: '', label: t('NONE') },
    { value: '13kWh', label: t('13KWH_1INV') }
  ]

  const miOptions = [...Array(99).keys()].map(number => ({
    label: number,
    value: number
  }))

  const handleCheckbox = e => {
    dispatch(
      SAVE_INVENTORY_RMA({
        name: e.target.name,
        value: e.target.checked
      })
    )
  }

  const handleChange = name => option => {
    dispatch(
      SAVE_INVENTORY_RMA({
        name: name,
        value: option.value
      })
    )
  }

  const handleContinue = () => {
    if (prop('other', rma)) {
      dispatch(START_DISCOVERY_INIT({ Device: 'allplusmime' }))
      history.push(paths.PROTECTED.LEGACY_DISCOVERY.path)
    } else if (prop('mi_count', rma)) {
      history.push(paths.PROTECTED.SCAN_LABELS.path)
    } else if (prop('ess', rma)) {
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
    <div className="rma-add-devices pr-20 pl-20">
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

          <div className="field  mb-20 mt-20">
            <SelectField
              isSearchable={false}
              onSelect={handleChange('mi_count')}
              defaultValue={find(
                propEq('value', prop('mi_count', rma)),
                miOptions
              )}
              options={miOptions}
            />
          </div>
        </div>

        <div className="collapsible mt-10">
          <div className="collapsible-header">
            <div className="collapsible-title">
              <label className="has-text-weight-bold" htmlFor="other">
                {t('EQUINOX_STORAGE_SYSTEM')}
              </label>
            </div>
          </div>
          <div className="field  mb-20 mt-20">
            <SelectField
              isSearchable={false}
              onSelect={handleChange('ess')}
              value={find(propEq('value', prop('ess', rma)), essOptions)}
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
                className="mr-10 checkbox"
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
