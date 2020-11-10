import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { equals, includes, map, path, pathOr, pluck, prop, union } from 'ramda'

import { useI18n } from 'shared/i18n'
import { UPDATE_DEVICES_LIST } from 'state/actions/devices'
import Collapsible from 'components/Collapsible'
import SelectField from 'components/SelectField'

import './ModelEdit.scss'

const buildSelectValue = value => ({
  label: value,
  value: value
})

const applyModel = (miList, selectedModel, selectedMi, dispatch) => {
  const updatedList = miList.map(mi => {
    if (includes(mi.SERIAL, selectedMi)) {
      mi.PANEL = selectedModel
    }
    return mi
  })
  dispatch(UPDATE_DEVICES_LIST(updatedList))
}

const MiGroup = ({ title = 'UNKNOWN_MI_TYPE', data, type }) => {
  const t = useI18n()
  const dispatch = useDispatch()
  const [selectedMi, setSelectedMi] = useState([])
  const [selectedModel, setSelectedModel] = useState()

  const { found } = useSelector(state => state.devices)
  const serialNumbers = pluck('SERIAL', data)
  const filteredMIs = found.filter(device =>
    includes(device.SERIAL, serialNumbers)
  )

  const filteredOptions = useSelector(pathOr([], ['devices', 'miModels', type]))

  const selectMi = serialNumber => {
    const filterDuplicates = union(selectedMi, [serialNumber])
    setSelectedMi(filterDuplicates)
  }

  const unSelectMi = serialNumber => {
    const filteredSelections = selectedMi.filter(item => item !== serialNumber)
    setSelectedMi(filteredSelections)
  }

  const handleCheckbox = e => {
    const item = e.target.name
    const isChecked = e.target.checked
    if (isChecked) selectMi(item)
    else unSelectMi(item)
  }

  const selectAll = (e, miGroup) => {
    e.preventDefault()
    const filterDuplicates = union(selectedMi, miGroup)
    setSelectedMi(filterDuplicates)
  }

  const notFoundText = t('NOT_FOUND')

  const selectModel = model => {
    setSelectedModel(path(['value'], model))
  }

  const createMiItem = miData => (
    <div key={miData.SERIAL} className="mi-item">
      <input
        type="checkbox"
        name={miData.SERIAL}
        onChange={handleCheckbox}
        className="mr-10 mi-item-checkbox"
        checked={!!selectedMi.find(equals(miData.SERIAL))}
      />
      <span className="is-uppercase has-text-weight-bold has-text-white mi-item-serialnumber">
        {miData.SERIAL}
      </span>
      <span className="has-text-white mi-item-modeldata">
        {miData.PANEL || t('NO_MODEL')}
      </span>
    </div>
  )

  return (
    <Collapsible title={title}>
      <div className="mi-container has-text-centered">
        <span className="has-text-white">Specify the model to apply</span>
        <SelectField
          isSearchable={true}
          options={map(buildSelectValue, filteredOptions)}
          onSelect={selectModel}
          notFoundText={notFoundText}
          className="mt-10 mb-10"
        />
        <div className="mi-list">{filteredMIs.map(createMiItem)}</div>
        <div className="inline-buttons">
          <button
            onClick={e => selectAll(e, data.map(prop('SERIAL')))}
            className="mt-20 mr-10 button is-outlined is-primary is-uppercase"
          >
            {t('SELECT_ALL')}
          </button>
          <button
            onClick={() =>
              applyModel(found, selectedModel, selectedMi, dispatch)
            }
            className="mt-20 ml-10 button is-primary is-uppercase"
          >
            {t('APPLY')}
          </button>
        </div>
      </div>
    </Collapsible>
  )
}

export default MiGroup
