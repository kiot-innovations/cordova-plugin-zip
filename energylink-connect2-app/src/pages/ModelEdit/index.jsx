import React, { useCallback, useEffect, useState } from 'react'
import clsx from 'clsx'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
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
  length,
  isEmpty,
  includes
} from 'ramda'
import SwipeableSheet from 'hocs/SwipeableSheet'
import { useI18n } from 'shared/i18n'
import { RESET_METADATA_STATUS, SET_METADATA_INIT } from 'state/actions/pvs'
import { CLAIM_DEVICES_RESET, FETCH_MODELS_INIT } from 'state/actions/devices'
import {
  ALLOW_COMMISSIONING,
  SUBMIT_CLEAR,
  SUBMIT_CONFIG_SUCCESS
} from 'state/actions/systemConfiguration'
import { rmaModes } from 'state/reducers/rma'
import { filterInverters, miTypes, either } from 'shared/utils'
import paths from 'routes/paths'
import { Loader } from 'components/Loader'
import MiGroup from './MiGroup'
import './ModelEdit.scss'
import { SET_AC_DEVICES } from 'state/actions/analytics'

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
  const { submitting, commissioned, error } = useSelector(
    path(['systemConfiguration', 'submit'])
  )
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

  const devicesWithModels = map(copyModel, found)

  const validateModels = () => {
    const filterModels = found.filter(
      mi => mi.DEVICE_TYPE === 'Inverter' && !mi.PANEL
    )
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

  const syncWithCloud = useCallback(() => {
    dispatch(SUBMIT_CLEAR())
    dispatch(SUBMIT_CONFIG_SUCCESS())
  }, [dispatch])

  const clearAndContinue = () => {
    dispatch(SUBMIT_CLEAR())
    history.push(paths.PROTECTED.SYSTEM_CONFIGURATION.path)
  }

  useEffect(() => {
    dispatch(FETCH_MODELS_INIT())
    dispatch(SET_AC_DEVICES())
  }, [dispatch])

  useEffect(() => {
    if (setMetadataStatus === 'success') {
      if (rmaMode === rmaModes.REPLACE_PVS) {
        dispatch(ALLOW_COMMISSIONING())
      }
      if (rmaMode === rmaModes.EDIT_DEVICES) {
        dispatch(RESET_METADATA_STATUS())
        syncWithCloud()
      } else if (essValue.value !== '0') {
        history.push(paths.PROTECTED.STORAGE_PREDISCOVERY.path)
      } else {
        history.push(
          rmaPvs
            ? paths.PROTECTED.SYSTEM_CONFIGURATION.path
            : paths.PROTECTED.INSTALL_SUCCESS.path
        )
      }
    }
  }, [
    history,
    essValue.value,
    rmaPvs,
    setMetadataStatus,
    rmaMode,
    dispatch,
    syncWithCloud
  ])

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

      <SwipeableSheet open={commissioned || submitting || !isEmpty(error)}>
        <div className="missing-models-warning is-flex pb-20">
          {either(
            submitting,
            <>
              <span className="has-text-weight-bold has-text-white">
                {t('HOLD_ON')}
              </span>
              <span className="has-text-white mt-10 mb-10">
                {t('ADDING_DEVICES')}
              </span>
              <Loader />
              <span className="has-text-weight-bold mt-10">
                {t('DONT_CLOSE_APP')}
              </span>
            </>
          )}
          {either(
            !isEmpty(error),
            either(
              includes('COMMISSIONCFG4005', error),
              <>
                <div className="mt-10 mb-10">
                  <span className="is-size-1 sp-hey has-text-white" />
                </div>
                <div className="mb-5">
                  <span className="has-text-weight-bold">
                    {t('ALMOST_THERE')}
                  </span>
                </div>
                <div className="mb-10">
                  <span>{t('MISSING_METER_SUBTYPES')}</span>
                </div>
                <div className="has-text-centered">
                  <span>
                    <button
                      className="button is-primary"
                      onClick={() =>
                        history.push(paths.PROTECTED.SYSTEM_CONFIGURATION.path)
                      }
                    >
                      {t('CONFIGURE_METERS')}
                    </button>
                  </span>
                </div>
              </>,
              <>
                <div className="mt-10 mb-10">
                  <span className="is-size-1 sp-hey has-text-white" />
                </div>
                <div className="mt-10 has-text-white">
                  <span>{t('ADDING_DEVICES_ERROR')}</span>
                </div>
                <div className="mt-10 has-text-centered">
                  <span>
                    <button
                      className="button is-primary"
                      onClick={syncWithCloud}
                    >
                      {t('RETRY')}
                    </button>
                  </span>
                </div>
              </>
            )
          )}
          {either(
            commissioned,
            <>
              <span className="has-text-weight-bold">{t('SUCCESS')}</span>
              <span className="mt-10 mb-10">{t('ADDING_DEVICES_SUCCESS')}</span>
              <div className="mt-10 mb-10">
                <span className="is-size-4 sp-check has-text-white" />
              </div>
              <div className="mt-10 has-text-centered">
                <span>
                  <button
                    className="button is-primary"
                    onClick={clearAndContinue}
                  >
                    {t('CONTINUE')}
                  </button>
                </span>
              </div>
            </>
          )}
        </div>
      </SwipeableSheet>
    </div>
  )
}

export default ModelEdit
