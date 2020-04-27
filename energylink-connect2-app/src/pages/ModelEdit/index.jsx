import React, { useEffect } from 'react'
import clsx from 'clsx'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { groupBy, path, prop, length } from 'ramda'
import { useI18n } from 'shared/i18n'
import { SET_METADATA_INIT } from 'state/actions/pvs'
import { CLAIM_DEVICES_RESET } from 'state/actions/devices'
import { filterInverters } from 'shared/utils'
import useModal from 'hooks/useModal'
import paths from 'routes/paths'
import MiGroup from './MiGroup'
import './ModelEdit.scss'

const miTypes = {
  AC_Module_Type_E: 'Type E',
  AC_Module_Type_G: 'Type G',
  AC_Module_Type_C: 'Type C',
  AC_Module_Type_D: 'Type D'
}

const ModelEdit = () => {
  const t = useI18n()
  const history = useHistory()
  const dispatch = useDispatch()
  const { settingMetadata, setMetadataStatus } = useSelector(state => state.pvs)
  const { candidates, found } = useSelector(state => state.devices)
  const siteKey = useSelector(path(['site', 'site', 'siteKey']))

  const resetClaim = () => {
    dispatch(CLAIM_DEVICES_RESET())
    history.goBack()
  }

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

  const miSource = length(candidates) > 0 ? candidates : filterInverters(found)
  const groupedSerialNumbers = groupBy(prop('MODEL'), miSource)

  const { modal, toggleModal } = useModal(modalContent, modalTitle, false)

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
      />
    ))
  }

  useEffect(() => {
    if (setMetadataStatus === 'success') {
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
          onClick={resetClaim}
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
