import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useI18n } from 'shared/i18n'
import { useForm, useField } from 'react-final-form-hooks'
import paths from 'routes/paths'
import './InventoryCounts.scss'

function createSelectField(t, translation, field) {
  const options = [...Array(21).keys()].map(number => {
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
        key={field}
        input={field.input}
        meta={field.meta}
        className="input mt-5"
      >
        {options}
      </select>
    </div>
  )
}

function InventoryCount() {
  const t = useI18n()
  const dispatch = useDispatch()

  const { form, handleSubmit } = useForm({
    onSubmit: onSubmit(dispatch),
    validate: values => null
  })

  const modules = useField('modules', form)
  const stringInverters = useField('stringInverters', form)
  const meters = useField('meters', form)
  const ess = useField('ess', form)
  const storageInverters = useField('storageInverters', form)
  const transferSwitches = useField('transferSwitches', form)
  const batteries = useField('batteries', form)
  const gcm = useField('gcm', form)
  const metStation = useField('metStation', form)

  return (
    <section className="is-flex tile is-vertical section pt-0">
      <h1 className="has-text-centered is-uppercase has-text-weight-bold">
        {t('INVENTORY_COUNT')}
      </h1>

      <form onSubmit={handleSubmit} className="mt-20 pt-20">
        <div className="form-container level">
          {createSelectField(t, 'MODULES', modules)}
          {createSelectField(t, 'STRING_INVERTERS', stringInverters)}
          {createSelectField(t, 'METERS', meters)}
          {createSelectField(t, 'ESS', ess)}
          {createSelectField(t, 'STORAGE_INVERTERS', storageInverters)}
          {createSelectField(t, 'TRANSFER_SWITCHES', transferSwitches)}
          {createSelectField(t, 'BATTERIES', batteries)}
          {createSelectField(t, 'GCM', gcm)}
          {createSelectField(t, 'MET_STATION', metStation)}
        </div>

        <div className="is-flex file level space-around section pt-0">
          <button
            className="button is-primary is-uppercase mb-15"
            type="submit"
          >
            {t('DONE')}
          </button>

          <Link to={paths.PROTECTED.ROOT.path}>{t('CANCEL')}</Link>
        </div>
      </form>
    </section>
  )
}

export default InventoryCount

function onSubmit(dispatch) {
  return values => null
}
