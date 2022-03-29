import moment from 'moment'
import { path, pathOr, propOr, isEmpty, length } from 'ramda'
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'

import ContinueFooter from 'components/ESSContinueFooter'
import ErrorDetected from 'components/ESSErrorDetected'
import { Loader } from 'components/Loader'
import StorageDevices from 'components/PrediscoveryDevices/StorageDevices'
import paths from 'routes/paths'
import { useI18n } from 'shared/i18n'
import {
  createMeterConfig,
  either,
  getMicroinverters,
  getStringInverters,
  warningsLength,
  withoutInfoCodes
} from 'shared/utils'
import {
  GET_PREDISCOVERY,
  GET_PREDISCOVERY_RESET,
  GET_DELAYED_PREDISCOVERY
} from 'state/actions/storage'
import { SUBMIT_METERCONFIG } from 'state/actions/systemConfiguration'
import { rmaModes } from 'state/reducers/rma'

import './StoragePrediscovery.scss'

function StoragePrediscovery() {
  const t = useI18n()
  const dispatch = useDispatch()
  const history = useHistory()

  const { found } = useSelector(state => state.devices)
  const siteKey = useSelector(path(['site', 'site', 'siteKey']))
  const { prediscovery, loadingPrediscovery } = useSelector(
    state => state.storage
  )
  const { rmaMode } = useSelector(state => state.rma)
  const { error } = useSelector(state => state.storage)
  const storageDeviceList = pathOr(
    [],
    ['pre_discovery_report', 'devices'],
    prediscovery
  )
  const prediscoveryErrors = propOr([], 'errors', prediscovery)

  const noInfo = withoutInfoCodes(prediscoveryErrors)
  const warningsCount = warningsLength(noInfo)
  const errorsDetected = length(noInfo) - warningsCount

  const inverters = [...getMicroinverters(found), ...getStringInverters(found)]

  const lastTimestamp = propOr(
    moment().toISOString(),
    'last_updated',
    prediscovery
  )

  useEffect(() => {
    const storageMeterConfigs = {
      productionCT: 'GROSS_PRODUCTION_SITE',
      consumptionCT: 'NET_CONSUMPTION_LOADSIDE'
    }

    const metaData = createMeterConfig(found, storageMeterConfigs, siteKey)
    dispatch(
      SUBMIT_METERCONFIG({
        metaData,
        singleConfig: true
      })
    )
  }, [dispatch, found, siteKey])

  useEffect(() => {
    dispatch(GET_PREDISCOVERY())
  }, [dispatch])

  const retryPrediscovery = () => {
    dispatch(GET_PREDISCOVERY_RESET())
    dispatch(GET_DELAYED_PREDISCOVERY(lastTimestamp))
  }

  return (
    <div className="storage-prediscovery">
      <div className="prediscovery-title has-text-centered mt-10 mb-20">
        {either(
          rmaMode === rmaModes.EDIT_DEVICES || !isEmpty(inverters),
          <span
            className="sp-chevron-left has-text-primary is-size-4 go-back"
            onClick={() => history.push(paths.PROTECTED.RMA_DEVICES.path)}
          />,
          <div />
        )}
        <span className="is-uppercase has-text-weight-bold">
          {t('STORAGE_DEVICES')}
        </span>
      </div>
      {either(
        loadingPrediscovery,
        <div className="prediscovery-waiting has-text-centered">
          <Loader />
          <span>{t('PREDISCOVERY_WAIT')}</span>
        </div>,
        <>
          {either(
            isEmpty(error),
            <div className="prediscovery-content has-text-centered is-flex mt-20 mb-20 pl-15 pr-15">
              {either(
                isEmpty(storageDeviceList),
                <>
                  <span className="is-size-1 sp-hey has-text-white mb-15" />
                  <span>{t('NO_PREDISCOVERY')}</span>
                </>,
                <StorageDevices devices={storageDeviceList} />
              )}
            </div>
          )}

          <div className="prediscovery-footer">
            {either(
              !isEmpty(error),

              <div className="prediscovery-retry has-text-centered is-flex mt-15 mb-15 pl-15 pr-15">
                <span className="mb-15">{t('PREDISCOVERY_ERROR')}</span>
                <button
                  className="button is-primary"
                  onClick={retryPrediscovery}
                >
                  {t('RETRY')}
                </button>
              </div>,

              either(
                isEmpty(noInfo),
                <ContinueFooter
                  url={paths.PROTECTED.EQS_UPDATE.path}
                  text={'PREDISCOVERY_SUCCESS'}
                />,
                <ErrorDetected
                  number={errorsDetected}
                  warnings={warningsCount}
                  onRetry={retryPrediscovery}
                  url={paths.PROTECTED.EQS_PREDISCOVERY_ERRORS.path}
                  next={paths.PROTECTED.EQS_UPDATE.path}
                />
              )
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default StoragePrediscovery
