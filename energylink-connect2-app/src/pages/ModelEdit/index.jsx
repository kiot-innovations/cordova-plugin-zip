import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FETCH_MODELS_INIT } from 'state/actions/devices'
import { useI18n } from 'shared/i18n'
import paths from 'routes/paths'
import { groupBy } from 'shared/utils'
import './ModelEdit.scss'
import MiGroup from './MiGroup'

const ModelEdit = ({ animationState }) => {
  const t = useI18n()
  const dispatch = useDispatch()
  const { serialNumbers } = useSelector(state => state.pvs)

  const groupedSerialNumbers = groupBy(serialNumbers, 'model')

  const collapsibleElements = () => {
    return Object.keys(groupedSerialNumbers).map((key, i) => (
      <MiGroup key={key} title={key} data={groupedSerialNumbers[key]} />
    ))
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
      <Link to={paths.PROTECTED.DEVICES.path} className="link is-uppercase">
        <small>{t('BACK')}</small>
      </Link>
    </div>
  )
}

export default ModelEdit
