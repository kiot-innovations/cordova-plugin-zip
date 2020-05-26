import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useI18n } from 'shared/i18n'
import { useHistory } from 'react-router-dom'
import {
  CLAIM_DEVICES_INIT,
  FETCH_CANDIDATES_COMPLETE
} from 'state/actions/devices'
import { START_DISCOVERY_INIT } from 'state/actions/pvs'
import { filterInverters } from 'shared/utils'
import { groupBy, prop, propOr, length, pluck, reduce, add } from 'ramda'
import clsx from 'clsx'
import paths from 'routes/paths'
import DeviceGroup from './DeviceGroup'
import './LegacyDiscovery.scss'

const claimDevices = (devices, dispatch) => {
  const inverters = filterInverters(devices)
  const claimObject = inverters.map(mi => {
    mi.OPERATION = 'add'
    return mi
  })
  dispatch(CLAIM_DEVICES_INIT(claimObject))
}

const LegacyDiscovery = () => {
  const t = useI18n()
  const history = useHistory()
  const {
    claimingDevices,
    claimError,
    claimedDevices,
    found,
    progress
  } = useSelector(state => state.devices)
  const dispatch = useDispatch()

  const discoveryComplete = propOr(false, 'complete', progress)

  useEffect(() => {
    if (!discoveryComplete) {
      dispatch(FETCH_CANDIDATES_COMPLETE())
    }
    if (claimedDevices) {
      history.push(paths.PROTECTED.MODEL_EDIT.path)
    }
  }, [claimedDevices, discoveryComplete, dispatch, history])

  const restartDiscovery = () => {
    dispatch(START_DISCOVERY_INIT({ Device: 'allplusmime' }))
    dispatch(FETCH_CANDIDATES_COMPLETE())
  }

  const discoveryProgress = propOr([], 'progress', progress)
  const deviceProgress = pluck('PROGR', discoveryProgress)
  const overallProgress = Math.floor(
    reduce(add, 0, deviceProgress) / length(deviceProgress)
  )

  const groupedDevices =
    length(found) > 0 ? groupBy(prop('DEVICE_TYPE'), found) : []

  return (
    <div className="legacy-discovery fill-parent has-text-centered pr-15 pl-15">
      <div className="legacy-discovery__title">
        <span className="is-uppercase has-text-weight-bold mb-20">
          {t('LEGACY_DISCOVERY')}
        </span>
      </div>
      <div className="legacy-discovery__devices">
        {Object.keys(groupedDevices).map((key, i) => (
          <DeviceGroup
            discoveryComplete={discoveryComplete}
            title={key}
            data={groupedDevices[key]}
          />
        ))}
      </div>
      {discoveryComplete ? (
        <div className="legacy-discovery__complete is-flex flex-column">
          <span className="has-text-weight-bold">
            {t('DISCOVERY_COMPLETE')}
          </span>
          <span className="has-text-weight-bold has-text-white mt-10 mb-20">
            {claimError
              ? t('CLAIM_DEVICES_ERROR', claimError)
              : t('REMOVE_UNWANTED_MIS')}
          </span>
          <div className="inline-buttons">
            <button
              onClick={restartDiscovery}
              className="button half-button-padding is-secondary is-uppercase trigger-scan mr-10"
            >
              {t('REDISCOVER')}
            </button>
            <button
              disabled={claimingDevices}
              onClick={() => claimDevices(found, dispatch)}
              className={clsx(
                'button half-button-padding is-primary is-uppercase trigger-scan',
                { 'is-loading': claimingDevices }
              )}
            >
              {claimError ? t('RETRY') : t('CONTINUE')}
            </button>
          </div>
        </div>
      ) : (
        <div className="legacy-discovery__progress has-text-centered is-flex flex-column">
          <span className="discovery-percentage mb-20 has-text-weight-bold is-size-1 has-text-white">
            {overallProgress || 0} %
          </span>
          <span className="has-text-weight-bold">
            {t('DISCOVERY_IN_PROGRESS')}
          </span>
        </div>
      )}
    </div>
  )
}

export default LegacyDiscovery
