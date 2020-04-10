import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { groupBy, prop } from 'ramda'
import { FETCH_MODELS_INIT } from 'state/actions/devices'
import { useI18n } from 'shared/i18n'
import './ModelEdit.scss'
import MiGroup from './MiGroup'

const ModelEdit = ({ animationState }) => {
  const t = useI18n()
  const dispatch = useDispatch()
  const history = useHistory()

  const { serialNumbers } = useSelector(state => state.pvs)

  const groupedSerialNumbers = groupBy(prop('miType'), serialNumbers)

  const collapsibleElements = () => {
    return Object.keys(groupedSerialNumbers).map((key, i) => (
      <MiGroup key={key} title={key} data={groupedSerialNumbers[key]} />
    ))
  }

  const goBack = () => {
    history.goBack()
  }

  useEffect(() => {
    if (animationState === 'enter') {
      dispatch(FETCH_MODELS_INIT())
    }
  }, [animationState, dispatch])

  return (
    <div className="model-edit is-vertical has-text-centered pr-10 pl-10">
      <span className="is-uppercase has-text-weight-bold">
        Edit Micro Inverter Models
      </span>

      <div className="model-container">{collapsibleElements()}</div>
      <div>
        <button
          className="button is-outlined is-primary has-text-primary mb-20"
          onClick={goBack}
        >
          {t('BACK')}
        </button>
      </div>
    </div>
  )
}

export default ModelEdit
