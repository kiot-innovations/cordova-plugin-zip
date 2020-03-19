import React, { useState } from 'react'
import { useI18n } from 'shared/i18n'
import './ModelEdit.scss'
import SearchField from '../../components/SearchField'
import Collapsible from '../../components/Collapsible'
import { uniq } from 'ramda'

const MiGroup = ({ title, data }) => {
  const t = useI18n()
  const [selectedMi, setSelectedMi] = useState([])

  const selectMi = serialNumber => {
    const currentSelections = selectedMi
    const filterDuplicates = uniq([...currentSelections, serialNumber])
    setSelectedMi(filterDuplicates)
  }

  const unSelectMi = serialNumber => {
    const currentSelections = selectedMi
    const filteredSelections = currentSelections.filter(
      item => item !== serialNumber
    )
    setSelectedMi(filteredSelections)
  }

  const handleCheckbox = e => {
    const item = e.target.name
    const isChecked = e.target.checked
    isChecked ? selectMi(item) : unSelectMi(item)
  }

  const selectAll = (e, miGroup) => {
    e.preventDefault()
    const currentSelections = selectedMi
    const filterDuplicates = uniq([...currentSelections, ...miGroup])
    setSelectedMi(filterDuplicates)
  }

  const notFoundText = t('NOT_FOUND')

  const cleanString = (str = '') => {
    const regex = /\W+/g
    return str.replace(regex, '')
  }

  const fetchModel = (inputValue, cb) => {
    const searchStr = cleanString(inputValue)
    alert(searchStr)
  }

  const selectModel = model => {
    alert(model)
  }

  const createMiItem = miData => (
    <div key={miData.serial_number} className="mi-item">
      <input
        type="checkbox"
        name={miData.serial_number}
        onChange={handleCheckbox}
        className="mr-10 mi-item-checkbox"
        checked={!!selectedMi.find(item => item === miData.serial_number)}
      />
      <span className="is-uppercase has-text-weight-bold has-text-white mi-item-serialnumber">
        {miData.serial_number}
      </span>
      <span className="has-text-white mi-item-modeldata">
        {miData.modelStr ? miData.modelStr : t('NO_MODEL')}
      </span>
    </div>
  )

  return (
    <Collapsible title={title}>
      <div className="mi-container has-text-centered">
        <span className="has-text-white">Specify the model to apply</span>
        <SearchField
          onSearch={fetchModel}
          onSelect={selectModel}
          notFoundText={notFoundText}
          className="mt-10 mb-10"
        />
        <div className="mi-list">
          {data.map(miData => createMiItem(miData))}
        </div>
        <button
          onClick={e =>
            selectAll(
              e,
              data.map(miData => miData.serial_number)
            )
          }
          className="mt-20 button is-outlined is-primary"
        >
          {t('SELECT_ALL')}
        </button>
      </div>
    </Collapsible>
  )
}

export default MiGroup
