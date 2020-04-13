import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import paths from 'routes/paths'
import { useI18n } from 'shared/i18n'
import { groupBy } from 'shared/utils'
import MiGroup from './MiGroup'
import './ModelEdit.scss'

const ModelEdit = () => {
  const t = useI18n()
  const { serialNumbers } = useSelector(state => state.pvs)

  const groupedSerialNumbers = groupBy(serialNumbers, 'model')

  const collapsibleElements = () => {
    return Object.keys(groupedSerialNumbers).map((key, i) => (
      <MiGroup key={key} title={key} data={groupedSerialNumbers[key]} />
    ))
  }

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
