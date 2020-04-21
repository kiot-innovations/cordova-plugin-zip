/* eslint react-hooks/exhaustive-deps: 0 */
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
  filter,
  pluck
} from 'ramda'
import { FETCH_MODELS_INIT } from 'state/actions/devices'
import { cleanString } from 'shared/utils'
import './ModelEdit.scss'
import SearchField from '../../components/SearchField'
import Collapsible from '../../components/Collapsible'
import { UPDATE_DEVICES_LIST } from 'state/actions/devices'

const buildSelectValue = value => ({
  label: value,
  value: value
})

const MiGroup = ({ title, data, animationState }) => {
  const t = useI18n()
  const dispatch = useDispatch()
  const [selectedMi, setSelectedMi] = useState([])
  const [selectedModel, setSelectedModel] = useState()

  const { found } = useSelector(state => state.devices)
  const serialNumbers = pluck('SERIAL', data)
  const filteredMIs = found.filter(device =>
    includes(device.SERIAL, serialNumbers)
  )

  const miTypes = {
    'Type E': 'E',
    'Type G': 'G',
    'Type C': 'C',
    'Type D': 'D'
  }

  useEffect(() => {
    if (animationState === 'enter') {
      dispatch(FETCH_MODELS_INIT(miTypes[title]))
    }
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
    const miList = found
    const updatedList = miList.map(mi => {
      if (includes(mi.SERIAL, selectedMi)) {
        mi.modelStr = selectedModel
      }
      return mi
    })
    dispatch(UPDATE_DEVICES_LIST(updatedList))
  }

  const createMiItem = miData => (
    <div key={miData.SERIAL} className="mi-item">
      <input
        type="checkbox"
        name={miData.SERIAL}
        onChange={handleCheckbox}
        className="mr-10 mi-item-checkbox"
        checked={!!selectedMi.find(item => item === miData.SERIAL)}
      />
      <span className="is-uppercase has-text-weight-bold has-text-white mi-item-serialnumber">
        {miData.SERIAL}
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
          {filteredMIs.map(miData => createMiItem(miData))}
        </div>
        <div className="inline-buttons">
          <button
            onClick={e =>
              selectAll(
                e,
                data.map(miData => miData.SERIAL)
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
