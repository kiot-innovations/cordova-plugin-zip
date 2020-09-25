import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { compose, find, groupBy, last, path, prop, propEq, split } from 'ramda'
import SwipeableBottomSheet from 'react-swipeable-bottom-sheet'
import { useI18n } from 'shared/i18n'
import { SET_METADATA_INIT } from 'state/actions/pvs'
import { CLAIM_DEVICES_RESET, FETCH_MODELS_INIT } from 'state/actions/devices'
import { filterInverters, miTypes } from 'shared/utils'
import paths from 'routes/paths'
import MiGroup from './MiGroup'
import './ModelEdit.scss'

const getDeviceType = compose(last, split('_'))

const ModelEdit = () => {
  const t = useI18n()
  const history = useHistory()
  const dispatch = useDispatch()
  const { settingMetadata, setMetadataStatus } = useSelector(state => state.pvs)
  const { found } = useSelector(state => state.devices)
  const rmaPvs = useSelector(path(['rma', 'pvs']))
  const { bom } = useSelector(state => state.inventory)
  const siteKey = useSelector(path(['site', 'site', 'siteKey']))
  const essValue = find(propEq('item', 'ESS'), bom)

  const resetClaim = () => {
    dispatch(CLAIM_DEVICES_RESET())
    history.goBack()
  }

  const miSource = filterInverters(found)
  const groupedSerialNumbers = groupBy(prop('MODEL'), miSource)

  const [warning, toggleWarning] = useState(false)

  const validateModels = () => {
    const filterModels = found.filter(
      mi => mi.DEVICE_TYPE === 'Inverter' && !mi.modelStr
    )
    if (filterModels.length > 0) {
      toggleWarning(true)
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

  useEffect(() => {
    dispatch(FETCH_MODELS_INIT())
  }, [dispatch])

  useEffect(() => {
    if (setMetadataStatus === 'success') {
      if (essValue.value !== '0') {
        history.push(paths.PROTECTED.STORAGE_PREDISCOVERY.path)
      } else {
        history.push(
          rmaPvs
            ? paths.PROTECTED.SYSTEM_CONFIGURATION.path
            : paths.PROTECTED.INSTALL_SUCCESS.path
        )
      }
    }
  }, [history, essValue.value, rmaPvs, setMetadataStatus])

  return (
    <div className="model-edit is-vertical has-text-centered pr-10 pl-10">
      <span className="is-uppercase has-text-weight-bold">
        {t('EDIT_MODELS')}
      </span>

      <div className="model-container">
        {Object.keys(groupedSerialNumbers).map(key => (
          <MiGroup
            key={key}
            title={miTypes[key]}
            data={groupedSerialNumbers[key]}
            type={getDeviceType(key)}
          />
        ))}
      </div>
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

      <SwipeableBottomSheet
        shadowTip={false}
        open={warning}
        onChange={() => toggleWarning(!warning)}
      >
        <div className="missing-models-warning is-flex">
          <span className="has-text-weight-bold">{t('ATTENTION')}</span>
          <span className="mt-10 mb-10">{t('MISSING_MODELS')}</span>
          <div className="mt-10 mb-20">
            <button
              className="button is-primary"
              onClick={() => toggleWarning(false)}
            >
              {t('CLOSE')}
            </button>
          </div>
        </div>
      </SwipeableBottomSheet>
    </div>
  )
}

export default ModelEdit
