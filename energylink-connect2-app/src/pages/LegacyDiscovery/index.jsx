import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useI18n } from 'shared/i18n'
import './LegacyDiscovery.scss'
import { FETCH_CANDIDATES_COMPLETE } from 'state/actions/devices'
import { START_DISCOVERY_INIT } from 'state/actions/pvs'
import { groupBy, prop, propOr, length, pluck, reduce, add } from 'ramda'
import DeviceGroup from './DeviceGroup'

const LegacyDiscovery = ({ animationState }) => {
  const t = useI18n()
  const { found, progress } = useSelector(state => state.devices)
  const dispatch = useDispatch()

  useEffect(() => {
    if (animationState === 'enter') {
      dispatch(FETCH_CANDIDATES_COMPLETE())
    }
  }, [animationState, dispatch])

  const restartDiscovery = () => {
    dispatch(START_DISCOVERY_INIT())
    dispatch(FETCH_CANDIDATES_COMPLETE())
  }

  const discoveryComplete = propOr(false, 'complete', progress)

  const discoveryProgress = propOr([], 'progress', progress)
  const deviceProgress = pluck('PROGR', discoveryProgress)
  const overallProgress = Math.floor(
    reduce(add, 0, deviceProgress) / length(deviceProgress)
  )

  const groupedDevices =
    length(found) > 0 ? groupBy(prop('DEVICE_TYPE'))(found) : []

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
            {t('REMOVE_UNWANTED_MIS')}
          </span>
          <div className="inline-buttons">
            <button
              onClick={restartDiscovery}
              className="button half-button-padding is-secondary trigger-scan mr-10"
            >
              {t('SCAN_MORE')}
            </button>
            <button className="button half-button-padding is-primary trigger-scan">
              {t('CONTINUE')}
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
