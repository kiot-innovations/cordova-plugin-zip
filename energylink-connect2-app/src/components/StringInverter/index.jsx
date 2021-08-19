import { propOr } from 'ramda'
import React from 'react'
import { useSelector } from 'react-redux'

import SelectField from 'components/SelectField'
import TextInput from 'components/TextInput'
import { useI18n } from 'shared/i18n'
import { either, isUnknownSerialNumber } from 'shared/utils'

import 'components/StringInverter/StringInverter.scss'

const inverterNumber = [...Array(51).keys()].map(number => ({
  label: number,
  value: number
}))

const StringInverter = ({ device, updateDevice, index }) => {
  const t = useI18n()
  const models = useSelector(({ stringInverters }) =>
    stringInverters.models.map(model => ({
      label: model,
      value: model
    }))
  )
  const { MODEL, SERIAL, COUNT } = device

  const selectModelValue = {
    label: propOr('', 'panelModel', device),
    value: propOr('', 'panelModel', device)
  }

  return (
    <article className="string-inverter mb-25 pl-20 pr-20 pt-20 pb-20 pb-5 ">
      <h1 className="has-text-weight-bold has-text-white">{MODEL}</h1>
      <div className="has-text-weight-bold mt-10 mb-10 has-text-left">
        {t('SERIAL_NUMBER')}
        {either(
          isUnknownSerialNumber(SERIAL),
          <span className="required ml-5 has-text-danger">*</span>
        )}
      </div>
      <TextInput
        disabled={!isUnknownSerialNumber(SERIAL)}
        placeholder={t('ENTER_INVERTER_SERIAL_NUMBER')}
        value={SERIAL}
        onChange={e =>
          updateDevice(index, { ...device, SERIAL: e.target.value })
        }
      />

      <div className="has-text-weight-bold mt-20 has-text-left">
        {t('MODULE_QUANTITY')}{' '}
        <span className="required has-text-danger">*</span>
      </div>

      <SelectField
        isSearchable={true}
        options={inverterNumber}
        onSelect={({ value }) =>
          updateDevice(index, { ...device, COUNT: value })
        }
        value={{
          label: COUNT,
          value: COUNT
        }}
        className="mt-10 mb-10"
      />
      <div className="has-text-weight-bold mt-20 has-text-left">
        {t('MODULE_MODEL')} <span className="required has-text-danger">*</span>
      </div>
      <SelectField
        options={models}
        onSelect={({ label }) =>
          updateDevice(index, { ...device, panelModel: label })
        }
        value={selectModelValue}
        notFoundText={t('NOT_FOUND')}
        className="mt-10 mb-10"
      />
    </article>
  )
}
export default StringInverter
