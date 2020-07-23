import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { pathOr, propOr, isEmpty, length } from 'ramda'
import moment from 'moment'
import { useI18n } from 'shared/i18n'
import { either } from 'shared/utils'
import { Loader } from 'components/Loader'
import { GET_PREDISCOVERY, GET_PREDISCOVERY_RESET } from 'state/actions/storage'
import ContinueFooter from 'components/ESSContinueFooter'
import ErrorDetected from 'components/ESSErrorDetected/ErrorDetected'
import StorageDevices from 'components/PrediscoveryDevices/StorageDevices'
import paths from 'routes/paths'
import './StoragePrediscovery.scss'

function StoragePrediscovery() {
  const t = useI18n()
  const dispatch = useDispatch()
  const [waiting, setWaiting] = useState(false)

  const { prediscovery } = useSelector(state => state.storage)
  const { error } = useSelector(state => state.storage)
  const storageDeviceList = pathOr(
    [],
    ['pre_discovery_report', 'devices'],
    prediscovery
  )
  const prediscoveryErrors = propOr([], 'errors', prediscovery)
  const lastTimestamp = propOr(
    moment().toISOString(),
    'last_updated',
    prediscovery
  )

  useEffect(() => {
    dispatch(GET_PREDISCOVERY())
  }, [dispatch])

  const retryPrediscovery = () => {
    dispatch(GET_PREDISCOVERY_RESET())
    setWaiting(true)
    const then = moment
      .utc(lastTimestamp)
      .local()
      .add(1, 'minutes')
    const now = moment()
    const diff = now.diff(then, 'milliseconds')
    const timeout = Math.abs(diff) + 3000
    if (diff < 0) {
      setTimeout(() => {
        setWaiting(false)
        dispatch(GET_PREDISCOVERY())
      }, timeout)
    } else {
      setWaiting(false)
      dispatch(GET_PREDISCOVERY())
    }
  }

  return (
    <div className="storage-prediscovery">
      <div className="prediscovery-title has-text-centered mt-10 mb-20">
        <span className="is-uppercase has-text-weight-bold">
          {t('STORAGE_DEVICES')}
        </span>
      </div>
      {either(
        waiting,
        <div className="prediscovery-waiting has-text-centered">
          <Loader />
          <span>{t('PREDISCOVERY_WAIT')}</span>
        </div>,
        <>
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
          <div className="prediscovery-footer">
            {either(
              isEmpty(prediscoveryErrors),
              isEmpty(error) ? (
                <ContinueFooter
                  url={paths.PROTECTED.EQS_UPDATE.path}
                  text={'DEVICE_MAPPING_SUCCESS'}
                />
              ) : (
                <div className="prediscovery-retry has-text-centered is-flex mt-15 mb-15 pl-15 pr-15">
                  <span className="mb-15">{t('PREDISCOVERY_ERROR')}</span>
                  <button
                    className="button is-primary"
                    onClick={retryPrediscovery}
                  >
                    {t('RETRY')}
                  </button>
                </div>
              ),
              <ErrorDetected
                number={length(prediscoveryErrors)}
                onRetry={retryPrediscovery}
                url={paths.PROTECTED.EQS_PREDISCOVERY_ERRORS.path}
              />
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default StoragePrediscovery
