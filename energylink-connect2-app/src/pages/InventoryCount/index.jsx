import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useI18n } from 'shared/i18n'
import { compose, find, propEq, propOr } from 'ramda'
import { saveInventory } from 'state/actions/inventory'
import { ALLOW_COMMISSIONING } from 'state/actions/systemConfiguration'
import clsx from 'clsx'
import paths from 'routes/paths'
import './InventoryCounts.scss'
import SwipeableBottomSheet from 'react-swipeable-bottom-sheet'

function submitInventory(inventory, dispatch, history, connected) {
  dispatch(saveInventory(inventory))
  if (connected) {
    history.push(paths.PROTECTED.PVS_PROVIDE_INTERNET.path)
  } else {
    history.push(paths.PROTECTED.CONNECT_TO_PVS.path)
  }
}

function createSelectField(
  disabled,
  t,
  translation,
  changeHandler,
  inventory,
  overrideOptions,
  size
) {
  const getItemValue = compose(
    propOr(0, 'value'),
    find(propEq('item', translation))
  )

  const itemValue = getItemValue(inventory)

  const options = overrideOptions
    ? overrideOptions.map(option => {
        return (
          <option
            key={option.value}
            value={option.value}
            selected={option.value === itemValue}
          >
            {t(option.text)}
          </option>
        )
      })
    : [...Array(99).keys()].map(number => {
        return (
          <option key={number} value={number}>
            {number}
          </option>
        )
      })

  return (
    <div
      key={translation}
      className={clsx({ 'form-input': true, double: size })}
    >
      <label htmlFor={translation} className="has-text-white">
        {t(translation)}
      </label>
      <select
        key={translation}
        name={translation}
        id={translation}
        className="input mt-5"
        onChange={changeHandler}
        defaultValue={itemValue}
        disabled={disabled}
      >
        {options}
      </select>
    </div>
  )
}

function InventoryCount() {
  const dispatch = useDispatch()
  const t = useI18n()
  const history = useHistory()

  const storedInventory = useSelector(({ inventory }) => inventory.bom)
  const { connected } = useSelector(state => state.network)

  const [inventory, setInventory] = useState(storedInventory)
  const [configWarning, setConfigWarning] = useState(false)
  const [storageWarning, setStorageWarning] = useState(false)

  const validateInventory = (event, inventory, dispatch, redirect) => {
    event.preventDefault()
    const miValue = find(propEq('item', 'AC_MODULES'), inventory)
    const storageValue = find(propEq('item', 'ESS'), inventory)
    if (miValue.value === '0') {
      if (storageValue.value === '0') {
        setConfigWarning(true)
      } else {
        setStorageWarning(true)
      }
    } else {
      submitInventory(inventory, dispatch, redirect, connected)
    }
  }

  const goToSelectPVS = () => {
    history.push(paths.PROTECTED.PVS_SELECTION_SCREEN.path)
  }

  const changeHandler = e => {
    const inventoryCopy = inventory
    inventoryCopy.map(item => {
      if (item.item === e.target.name) item.value = e.target.value
      return item
    })
    setInventory(inventoryCopy)
  }

  const batteryOptions = [
    { value: '0', text: 'NONE' },
    { value: '13kWh', text: '13KWH_1INV' },
    { value: '26kWh (1 inverter)', text: '26KWH_1INV' },
    { value: '26kWh (2 inverters)', text: '26KWH_2INV' }
  ]

  const fields = inventory.map(item => {
    if (item.item === 'ESS') {
      return createSelectField(
        item.disabled,
        t,
        item.item,
        changeHandler,
        inventory,
        batteryOptions,
        'double'
      )
    } else {
      return createSelectField(
        item.disabled,
        t,
        item.item,
        changeHandler,
        inventory
      )
    }
  })

  return (
    <section className="inventory-count pl-15 pr-15">
      <h1 className="has-text-centered is-uppercase has-text-weight-bold">
        {t('INVENTORY_COUNT')}
      </h1>
      <form className="mt-20 mb-20 vertical-scroll">
        <div className="form-container level">{fields}</div>
      </form>
      <div className="is-flex inline-buttons has-text-centered">
        <button
          className="button is-primary is-outlined is-fullwidth mr-5"
          onClick={goToSelectPVS}
        >
          {t('BACK')}
        </button>
        <button
          className="button is-primary is-fullwidth ml-5"
          type="submit"
          onClick={e => validateInventory(e, inventory, dispatch, history)}
        >
          {t('DONE')}
        </button>
      </div>

      <SwipeableBottomSheet
        shadowTip={false}
        open={storageWarning}
        onChange={() => setStorageWarning(!storageWarning)}
      >
        <div className="inventory-warning has-text-centered">
          <span className="has-text-weight-bold">
            {t('INVENTORY_STORAGE_ONLY')}
          </span>
          <div className="mt-20 mb-20">
            <div className="modal-inline-buttons">
              <button
                className="button is-primary is-outlined"
                onClick={() => setStorageWarning(!storageWarning)}
              >
                {t('CANCEL')}
              </button>
              <button
                className="button is-primary"
                onClick={() =>
                  submitInventory(inventory, dispatch, history, connected)
                }
              >
                {t('CONTINUE')}
              </button>
            </div>
          </div>
        </div>
      </SwipeableBottomSheet>

      <SwipeableBottomSheet
        shadowTip={false}
        open={configWarning}
        onChange={() => setConfigWarning(!configWarning)}
      >
        <div className="inventory-warning has-text-centered">
          <span className="has-text-weight-bold">
            {t('INVENTORY_CONFIG_ONLY')}
          </span>
          <div className="mt-20 mb-20">
            <div className="modal-inline-buttons">
              <button
                className="button is-primary is-outlined"
                onClick={() => setConfigWarning(!configWarning)}
              >
                {t('CANCEL')}
              </button>
              <button
                className="button is-primary"
                onClick={() => {
                  dispatch(ALLOW_COMMISSIONING())
                  submitInventory(inventory, dispatch, history, connected)
                }}
              >
                {t('CONTINUE')}
              </button>
            </div>
          </div>
        </div>
      </SwipeableBottomSheet>
    </section>
  )
}

export default InventoryCount
