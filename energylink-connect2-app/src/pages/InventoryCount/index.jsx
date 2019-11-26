import React, { useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useI18n } from 'shared/i18n'
import paths from 'routes/paths'
import './InventoryCounts.scss'
import { saveInventory } from '../../state/actions/inventory'

function submitInventory(event, inventory, dispatch, redirect) {
  event.preventDefault()
  dispatch(saveInventory(inventory))
  redirect(true)
}

function createSelectField(t, translation, changeHandler, inventory) {
  const options = [...Array(99).keys()].map(number => {
    return (
      <option key={number} value={number}>
        {number}
      </option>
    )
  })

  return (
    <div className="form-input">
      <label htmlFor="modules" className="has-text-white">
        {t(translation)}
      </label>
      <select
        key={translation}
        name={translation}
        className="input mt-5"
        onChange={changeHandler}
        value={inventory[translation]}
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
    setInventory({ ...inventory, [e.target.name]: e.target.value })
  }

  const fields = Object.keys(inventory).map(key => {
    return createSelectField(t, key, changeHandler, inventory)
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
        <Link to={paths.PROTECTED.BILL_OF_MATERIALS.path}>{t('CANCEL')}</Link>
      </div>
    </section>
  )
}

export default InventoryCount
