import React, { useEffect, useState } from 'react'
import { useI18n } from 'shared/i18n'
import { useDispatch, useSelector } from 'react-redux'
import {
  test,
  union,
  includes,
  path,
  pathOr,
  compose,
  map,
  filter
} from 'ramda'
import { UPDATE_MI_MODELS } from 'state/actions/pvs'
import { FETCH_MODELS_INIT } from 'state/actions/devices'
import { cleanString } from 'shared/utils'
import './ModelEdit.scss'
import SearchField from '../../components/SearchField'
import Collapsible from '../../components/Collapsible'

const buildSelectValue = value => ({
  label: value,
  value: value
})

const MiGroup = ({ title, data }) => {
  const t = useI18n()
  const dispatch = useDispatch()
  const [selectedMi, setSelectedMi] = useState([])
  const [selectedModel, setSelectedModel] = useState()

  const { serialNumbers } = useSelector(state => state.pvs)

  const miTypes = {
    'Type E': 'E',
    'Type G': 'G',
    'Type C': 'C',
    'Type D': 'D'
  }

  useEffect(() => {
    dispatch(FETCH_MODELS_INIT(miTypes[title]))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const modelOptions = useSelector(state =>
    pathOr([], ['devices', 'miModels'], state)
  )

  const filteredOptions = modelOptions.filter(
    options => options.type === miTypes[title]
  )

  const selectMi = serialNumber => {
    const currentSelections = selectedMi
    const filterDuplicates = union(currentSelections, [serialNumber])
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
    if (isChecked) selectMi(item)
    else unSelectMi(item)
  }

  const selectAll = (e, miGroup) => {
    e.preventDefault()
    const currentSelections = selectedMi
    const filterDuplicates = union(currentSelections, miGroup)
    setSelectedMi(filterDuplicates)
  }

  const notFoundText = t('NOT_FOUND')

  const filterModel = (inputValue, cb) => {
    const searchStr = cleanString(inputValue)
    const matchValue = test(new RegExp(searchStr, 'ig'))
    const models = pathOr([], [0, 'models'], filteredOptions)
    const getResults = compose(map(buildSelectValue), filter(matchValue))
    cb(getResults(models))
  }

  const selectModel = model => {
    setSelectedModel(path(['value'], model))
  }

  const applyModel = () => {
    const miList = serialNumbers
    const updatedList = miList.map(mi => {
      if (includes(mi.serial_number, selectedMi)) {
        mi.modelStr = selectedModel
      }
      return mi
    })
    dispatch(UPDATE_MI_MODELS(updatedList))
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
          onSearch={filterModel}
          onSelect={selectModel}
          notFoundText={notFoundText}
          className="mt-10 mb-10"
        />
        <div className="mi-list">
          {data.map(miData => createMiItem(miData))}
        </div>
        <div className="inline-buttons">
          <button
            onClick={e =>
              selectAll(
                e,
                data.map(miData => miData.serial_number)
              )
            }
            className="mt-20 mr-10 button is-outlined is-primary"
          >
            {t('SELECT_ALL')}
          </button>
          <button
            onClick={applyModel}
            className="mt-20 ml-10 button is-primary"
          >
            {t('APPLY')}
          </button>
        </div>
      </div>
    </Collapsible>
  )
}

export default MiGroup
