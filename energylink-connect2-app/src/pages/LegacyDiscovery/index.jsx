import clsx from 'clsx'
import { groupBy, prop, propOr, length, path } from 'ramda'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import DeviceGroup from './DeviceGroup'

import useModal from 'hooks/useModal'
import paths from 'routes/paths'
import { useI18n } from 'shared/i18n'
import {
  either,
  getMicroinverters,
  getOverallDiscoveryProgress
} from 'shared/utils'
import {
  CLAIM_DEVICES_INIT,
  FETCH_CANDIDATES_COMPLETE,
  RESET_DISCOVERY
} from 'state/actions/devices'
import { START_DISCOVERY_INIT } from 'state/actions/pvs'
import { discoveryTypes } from 'state/reducers/devices'

import './LegacyDiscovery.scss'

const claimDevices = (inverters, dispatch) => {
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
  const rmaPvs = useSelector(path(['rma', 'pvs']))
  const { lastDiscoveryType } = useSelector(state => state.pvs)
  const inverters = getMicroinverters(found)
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
    dispatch(RESET_DISCOVERY())
    dispatch(
      START_DISCOVERY_INIT({
        MIType: 'ALL',
        Device: 'allplusmime',
        Interfaces: 'mime',
        KeepDevices: '1',
        type: discoveryTypes.ONLYMI
      })
    )
    dispatch(FETCH_CANDIDATES_COMPLETE())
  }

  const overallProgress = getOverallDiscoveryProgress(progress)

  const groupedDevices =
    length(found) > 0 ? groupBy(prop('DEVICE_TYPE'), found) : []

  const continueWithZeroMIs = () => {
    toggleMicroinvertersModal()
    history.push(
      rmaPvs
        ? paths.PROTECTED.SYSTEM_CONFIGURATION.path
        : paths.PROTECTED.INSTALL_SUCCESS.path
    )
  }

  const microinvertersModalTitle = (
    <span className="has-text-white has-text-weight-bold">
      {t('ATTENTION')}
    </span>
  )

  const microinvertersModalContent = (
    <div className="sn-modal">
      <span className="has-text-white mb-10">
        {t('LEGACY_DISCOVERY_ZERO_MIS_WARNING')}
      </span>
      <div className="sn-buttons">
        <button
          className="button half-button-padding is-secondary is-uppercase trigger-scan mr-10"
          onClick={() => toggleMicroinvertersModal()}
        >
          {t('CANCEL')}
        </button>
        <button
          className="button half-button-padding is-primary is-uppercase trigger-scan"
          onClick={continueWithZeroMIs}
        >
          {t('CONTINUE')}
        </button>
      </div>
    </div>
  )

  const {
    modal: microinvertersModal,
    toggleModal: toggleMicroinvertersModal
  } = useModal(microinvertersModalContent, microinvertersModalTitle, false)

  return (
    <div className="legacy-discovery is-flex has-text-centered pr-15 pl-15 mb-10">
      {microinvertersModal}
      <div className="legacy-discovery__title">
        <div>
          {either(
            overallProgress === 100 &&
              lastDiscoveryType === discoveryTypes.ONLYMI,
            <span
              onClick={() => history.goBack()}
              className="sp-chevron-left is-size-4 has-text-primary"
            />
          )}
        </div>
        <div className="page-title has-text-centered has-text-weight-bold">
          {t('LEGACY_DISCOVERY')}
        </div>
        <div />
      </div>
      <div className="legacy-discovery__devices">
        {Object.keys(groupedDevices).map(key => (
          <DeviceGroup
            discoveryComplete={discoveryComplete}
            title={key}
            data={groupedDevices[key]}
          />
        ))}
      </div>
      {discoveryComplete ? (
        <div className="legacy-discovery__complete is-flex flex-column mt-20">
          <span className="has-text-weight-bold">
            {t('DISCOVERY_COMPLETE')}
          </span>
          <span className="has-text-weight-bold has-text-white mt-10 mb-20">
            {claimError
              ? t('CLAIM_DEVICES_ERROR', claimError)
              : t('REMOVE_UNWANTED_MIS')}
          </span>
          <div className="is-flex">
            <button
              onClick={restartDiscovery}
              className="button is-primary is-outlined is-uppercase is-fullwidth mr-5"
            >
              {t('REDISCOVER')}
            </button>
            <button
              disabled={claimingDevices}
              onClick={() =>
                length(inverters) > 0
                  ? claimDevices(inverters, dispatch)
                  : toggleMicroinvertersModal()
              }
              className={clsx(
                'button is-primary is-uppercase is-fullwidth ml-5',
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
