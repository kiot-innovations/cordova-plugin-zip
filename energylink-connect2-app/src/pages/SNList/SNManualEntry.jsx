import React from 'react'

import TextField from '@sunpower/textfield'
import { useDispatch } from 'react-redux'
import { useI18n } from 'shared/i18n'
import { isValidSN } from 'shared/utils'
import { useField, useForm } from 'react-final-form-hooks'
import { ADD_PVS_SN } from 'state/actions/pvs'
import './SNManualEntry.scss'

const ManualEntryForm = () => {
  const t = useI18n()
  const dispatch = useDispatch()

  const { form, handleSubmit } = useForm({
    onSubmit: ({ barcode }) => {
      dispatch(ADD_PVS_SN({ serial_number: barcode }))
    },
    validate: values => {
      const errors = {}

      if (!isValidSN(values.barcode)) {
        errors.barcode = t('SN_FIELD_ERROR_REGEX')
      }
      return errors
    }
  })

  const fieldBarcode = useField('barcode', form)

  return (
    <form
      className="sn-manual-entry"
      onSubmit={event => {
        handleSubmit(event)
        form.reset()
      }}
    >
      <label htmlFor="barcode" className="has-text-white is-flex">
        {t('MI_SN_LABEL')}
      </label>

      <div className="field is-grouped is-grouped-centered">
        <div className="control">
          <TextField
            input={fieldBarcode.input}
            meta={fieldBarcode.meta}
            type="text"
            autoComplete="barcode"
            className="field-barcode"
          />
        </div>
        <div className="control">
          <button
            className="button is-primary is-uppercase pl-10 pr-10 pb-30 pt-10"
            type="submit"
          >
            {t('ADD')}
          </button>
        </div>
      </div>
    </form>
  )
}

export default ManualEntryForm
