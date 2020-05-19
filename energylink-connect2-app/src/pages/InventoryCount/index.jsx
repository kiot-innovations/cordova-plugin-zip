import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useI18n } from 'shared/i18n'
import { compose, find, propEq, propOr } from 'ramda'
import clsx from 'clsx'
import paths from 'routes/paths'
import './InventoryCounts.scss'
import { saveInventory } from '../../state/actions/inventory'

function submitInventory(event, inventory, dispatch, redirect) {
  event.preventDefault()
  dispatch(saveInventory(inventory))
  redirect(true)
}

function createSelectField(
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
      >
        {options}
      </select>
    </div>
  )
}

function InventoryCount() {
  const dispatch = useDispatch()
  const t = useI18n()

  const storedInventory = useSelector(({ inventory }) => inventory.bom)

  const [inventory, setInventory] = useState(storedInventory)
  const [toBom, setToBom] = useState(false)

  const changeHandler = e => {
    const inventoryCopy = inventory
    inventoryCopy.map(item => {
      if (item.item === e.target.name) item.value = e.target.value
      return item
    })
    setInventory(inventoryCopy)
  }

  const batteryOptions = [
    { value: 'None', text: 'NONE' },
    { value: '16kWh', text: '16KWH_1INV' },
    { value: '26kWh 1 Inverter', text: '26KWH_1INV' },
    { value: '26kWh 2 Inverters', text: '26KWH_2INV' }
  ]

  const fields = inventory.map(item => {
    if (item.item === 'ESS') {
      return createSelectField(
        t,
        item.item,
        changeHandler,
        inventory,
        batteryOptions,
        'double'
      )
    } else {
      return createSelectField(t, item.item, changeHandler, inventory)
    }
  })

  return (
    <section className="inventory-count">
      {toBom ? <Redirect to={paths.PROTECTED.BILL_OF_MATERIALS.path} /> : null}
      <h1 className="has-text-centered is-uppercase has-text-weight-bold">
        {t('INVENTORY_COUNT')}
      </h1>
      <form className="mt-20 mb-30 vertical-scroll">
        <div className="form-container level">{fields}</div>
      </form>
      <div className="is-flex file level space-around section pt-0">
        <button
          className="button is-primary is-uppercase mb-15"
          type="submit"
          onClick={e => submitInventory(e, inventory, dispatch, setToBom)}
        >
          {t('DONE')}
        </button>
      </div>
    </section>
  )
}

export default InventoryCount
