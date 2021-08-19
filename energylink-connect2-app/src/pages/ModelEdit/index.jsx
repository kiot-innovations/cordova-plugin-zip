import clsx from 'clsx'
import {
  compose,
  find,
  groupBy,
  last,
  path,
  prop,
  propEq,
  split,
  map,
  length
} from 'ramda'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import MiGroup from './MiGroup'

import { Loader } from 'components/Loader'
import SwipeableSheet from 'hocs/SwipeableSheet'
import paths from 'routes/paths'
import { useI18n } from 'shared/i18n'
import { miTypes, either, getMicroinverters } from 'shared/utils'
import { SET_AC_DEVICES } from 'state/actions/analytics'
import { CLAIM_DEVICES_RESET, FETCH_MODELS_INIT } from 'state/actions/devices'
import { SET_LAST_VISITED_PAGE } from 'state/actions/global'
import { RESET_METADATA_STATUS, SET_METADATA_INIT } from 'state/actions/pvs'
import { ALLOW_COMMISSIONING } from 'state/actions/systemConfiguration'
import { rmaModes } from 'state/reducers/rma'
import './ModelEdit.scss'

const getDeviceType = compose(last, split('_'))

const renderMIGroup = (groupedSerialNumbers, miTypes) => key => (
  <MiGroup
    key={key}
    title={miTypes[key]}
    data={groupedSerialNumbers[key]}
    type={getDeviceType(key)}
  />
)

const copyModel = device => {
  if (device.PANEL) {
    device.modelStr = device.PANEL
  }
  return device
}

const ModelEdit = () => {
  const t = useI18n()
  const history = useHistory()
  const dispatch = useDispatch()
  const { rmaMode } = useSelector(state => state.rma)
  const { settingMetadata, setMetadataStatus } = useSelector(state => state.pvs)
  const { fetchingDevices, found } = useSelector(state => state.devices)
  const rmaPvs = useSelector(path(['rma', 'pvs']))
  const { bom } = useSelector(state => state.inventory)
  const siteKey = useSelector(path(['site', 'site', 'siteKey']))
  const essValue = find(propEq('item', 'ESS'), bom)

  const resetClaim = () => {
    dispatch(CLAIM_DEVICES_RESET())
    history.goBack()
  }

  const miSource = getMicroinverters(found)
  const groupedSerialNumbers = groupBy(prop('MODEL'), miSource)

  const [warning, toggleWarning] = useState(false)

  const devicesWithModels = map(copyModel, found)

  const validateModels = () => {
    const filterModels = miSource.filter(mi => !mi.PANEL)
    if (filterModels.length > 0) {
      toggleWarning(true)
    } else {
      const metadataObject = {
        metaData: {
          site_key: siteKey,
          devices: devicesWithModels
        }
      }
      dispatch(SET_METADATA_INIT(metadataObject))
    }
  }

  useEffect(() => {
    dispatch(FETCH_MODELS_INIT())
    dispatch(SET_AC_DEVICES())
  }, [dispatch])

  useEffect(() => {
    if (setMetadataStatus === 'success') {
      dispatch(ALLOW_COMMISSIONING())
      if (rmaMode === rmaModes.REPLACE_PVS) {
        dispatch(RESET_METADATA_STATUS())
        if (essValue.value !== '0') {
          history.push(paths.PROTECTED.STORAGE_PREDISCOVERY.path)
        } else {
          history.push(paths.PROTECTED.SYSTEM_CONFIGURATION.path)
        }
      } else {
        dispatch(RESET_METADATA_STATUS())
        dispatch(SET_LAST_VISITED_PAGE(paths.PROTECTED.RMA_DEVICES.path))
        history.push(paths.PROTECTED.RMA_DEVICES.path)
      }
    }
  }, [history, essValue.value, rmaPvs, setMetadataStatus, rmaMode, dispatch])

  return (
    <div className="model-edit is-vertical has-text-centered pr-10 pl-10">
      <span className="is-uppercase has-text-weight-bold">
        {t('EDIT_MODELS')}
      </span>

      <div className="model-container">
        {either(
          fetchingDevices,
          <>
            <Loader />
            <span className="mt-10 mb-10">{t('FETCHING_MODELS')}</span>
          </>,

          length(miSource) > 0 ? (
            map(
              renderMIGroup(groupedSerialNumbers, miTypes),
              Object.keys(groupedSerialNumbers)
            )
          ) : (
            <span className="mt-20 mb-20 is-size-4">{t('NO_MI_FOUND')}</span>
          )
        )}
      </div>

      {either(
        !fetchingDevices,
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
      )}

      <SwipeableSheet open={warning} onChange={() => toggleWarning(!warning)}>
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
      </SwipeableSheet>
    </div>
  )
}

export default ModelEdit
