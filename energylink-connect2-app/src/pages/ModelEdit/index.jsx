import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from 'shared/i18n'
import paths from 'routes/paths'
import './ModelEdit.scss'
import SearchField from '../../components/SearchField'

const ModelEdit = ({ animationState }) => {
  const t = useI18n()
  const [selectedMi, setSelectedMi] = useState([])

  const selectMi = serialNumber => {
    const currentSelections = selectedMi
    setSelectedMi([...currentSelections, serialNumber])
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

  //const { serialNumbers } = useSelector(state => state.pvs)
  const serialNumbers = [
    {
      bounding_box: { left: 1509, top: 2062, width: 1057, height: 65 },
      indicator: 'LOADING',
      model: 'Type E',
      serial_number: 'E00121938109605',
      state: 'GETTING_VERSION_INFORMATION',
      type: 'MI'
    },
    {
      bounding_box: { left: 1509, top: 2062, width: 1057, height: 65 },
      indicator: 'LOADING',
      model: 'Type E',
      serial_number: 'E00121938109606',
      state: 'GETTING_VERSION_INFORMATION',
      type: 'MI'
    },
    {
      bounding_box: { left: 1509, top: 2062, width: 1057, height: 65 },
      indicator: 'LOADING',
      model: 'Type E',
      serial_number: 'E00121938109607',
      state: 'GETTING_VERSION_INFORMATION',
      type: 'MI'
    },
    {
      bounding_box: { left: 1509, top: 2062, width: 1057, height: 65 },
      indicator: 'LOADING',
      model: 'Type E',
      serial_number: 'E00121938109608',
      state: 'GETTING_VERSION_INFORMATION',
      type: 'MI'
    }
  ]

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
        checked={serialNumbers.find(item => item === miData.serial_number)}
      />
      <span className="is-uppercase has-text-weight-bold has-text-white mi-item-serialnumber">
        {miData.serial_number}
      </span>
      <span className="has-text-white mi-item-modeldata">
        {miData.modelStr ? miData.modelStr : t('NO_MODEL')}
      </span>
    </div>
  )

  const miList = serialNumbers
    ? serialNumbers.map(miData => createMiItem(miData))
    : ''

  return (
    <div className="model-edit is-vertical has-text-centered">
      <span className="is-uppercase has-text-weight-bold">
        Edit Micro Inverter Models
      </span>

      <div className="mi-container has-text-centered ml-10 mr-10">
        <span className="has-text-white">Specify the model to apply</span>
        <SearchField
          onSearch={fetchModel}
          onSelect={selectModel}
          notFoundText={notFoundText}
          className="mt-10 mb-10"
        />
        <div className="mi-list">{miList}</div>
        <button className="mt-20 button is-outlined is-primary">
          {t('SELECT_ALL')}
        </button>
      </div>
      <Link to={paths.PROTECTED.DEVICES.path} className="link is-uppercase">
        <small>{t('BACK')}</small>
      </Link>
    </div>
  )
}

export default ModelEdit
