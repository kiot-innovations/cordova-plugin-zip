import React from 'react'
import { compose, isEmpty } from 'ramda'
import TextField from '@sunpower/textfield'
import { useDispatch } from 'react-redux'
import { useI18n } from 'shared/i18n'
import { buildSN, isValidSN } from 'shared/utils'
import { useField, useForm } from 'react-final-form-hooks'
import { ADD_PVS_SN } from 'state/actions/pvs'
import './SNManualEntry.scss'

const ManualEntryForm = ({ serialNumber, callback }) => {
  const t = useI18n()
  const dispatch = useDispatch()
  const addSN = compose(dispatch, ADD_PVS_SN, buildSN)

  const { form, handleSubmit } = useForm({
    initialValues: {
      barcode: serialNumber.startsWith('E00')
        ? serialNumber.slice(3)
        : serialNumber
    },
    onSubmit: ({ barcode }) => {
      callback && serialNumber && callback()
      addSN(barcode)
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
      <div className="is-flex file tile buttons-container">
        <div className="ifield mr-10">
          <TextField
            input={fieldBarcode.input}
            meta={fieldBarcode.meta}
            type="text"
            autoComplete="barcode"
            className="field-barcode"
            placeholder={t('ENTER_SERIAL_MANUALLY')}
          />
        </div>

        <button
          className="button is-paddingless has-text-primary has-text-weight-bold is-uppercase is-outlined button-transparent"
          type="submit"
        >
          {isEmpty(serialNumber) ? t('ADD') : t('SAVE')}
        </button>
      </div>
    </form>
  )
}

export default ManualEntryForm
