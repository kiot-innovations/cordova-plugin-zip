import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { groupBy, path, prop } from 'ramda'
import { useI18n } from 'shared/i18n'
import { SET_METADATA_INIT } from 'state/actions/pvs'
import useModal from 'hooks/useModal'
import paths from 'routes/paths'
import MiGroup from './MiGroup'
import './ModelEdit.scss'
import clsx from 'clsx'

const miTypes = {
  AC_Module_Type_E: 'Type E',
  AC_Module_Type_G: 'Type G',
  AC_Module_Type_C: 'Type C',
  AC_Module_Type_D: 'Type D'
}

const ModelEdit = ({ animationState }) => {
  const t = useI18n()
  const history = useHistory()
  const dispatch = useDispatch()
  const { settingMetadata, setMetadataStatus } = useSelector(state => state.pvs)
  const { candidates, found } = useSelector(state => state.devices)
  const siteKey = useSelector(path(['site', 'site', 'siteKey']))

  const modalContent = (
    <div className="has-text-centered">
      <span className="has-text-white">{t('MISSING_MODELS')}</span>
    </div>
  )

  const modalTitle = (
    <span className="has-text-white has-text-weight-bold">
      {t('ATTENTION')}
    </span>
  )

  const groupedSerialNumbers = groupBy(prop('MODEL'), candidates)

  const { modal, toggleModal } = useModal(
    animationState,
    modalContent,
    modalTitle,
    false
  )

  const validateModels = () => {
    const filterModels = found.filter(
      mi => mi.DEVICE_TYPE === 'Inverter' && !mi.modelStr
    )
    if (filterModels.length > 0) {
      toggleModal()
    } else {
      const metadataObject = {
        metaData: {
          site_key: siteKey,
          devices: [...found]
        }
      }
      dispatch(SET_METADATA_INIT(metadataObject))
    }
  }

  const collapsibleElements = () => {
    return Object.keys(groupedSerialNumbers).map((key, i) => (
      <MiGroup
        key={key}
        title={miTypes[key]}
        data={groupedSerialNumbers[key]}
        animationState={animationState}
      />
    ))
  }

  useEffect(() => {
    if (setMetadataStatus === 'success' && animationState !== 'leave') {
      history.push(paths.PROTECTED.INSTALL_SUCCESS.path)
    }
  })

  return (
    <div className="model-edit is-vertical has-text-centered pr-10 pl-10">
      {modal}
      <span className="is-uppercase has-text-weight-bold">
        {t('EDIT_MODELS')}
      </span>

      <div className="model-container">{collapsibleElements()}</div>
      <div>
        <button
          className="button is-uppercase is-outlined is-primary has-text-primary mb-20 mr-10"
          onClick={() => history.goBack()}
        >
          {t('BACK')}
        </button>
        <button
          className={clsx('button is-primary is-uppercase mb-20 ml-10', {
            'is-loading': settingMetadata
          })}
          disabled={settingMetadata}
          onClick={validateModels}
        >
          {t('SAVE')}
        </button>
      </div>
    </div>
  )
}

export default ModelEdit
