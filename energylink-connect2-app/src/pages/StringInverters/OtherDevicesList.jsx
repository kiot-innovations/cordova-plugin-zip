import {
  compose,
  flatten,
  groupBy,
  length,
  map,
  omit,
  pathOr,
  prop,
  propOr
} from 'ramda'
import React, { useState } from 'react'
import { CircularProgressbar } from 'react-circular-progressbar'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import Template from './StringInvertersTemplate'

import SwipeableSheet from 'hocs/SwipeableSheet'
import useRetryStringInverterDiscovery from 'hooks/useRetryLegacyDiscovery'
import paths from 'routes/paths'
import { useI18n } from 'shared/i18n'
import {
  average,
  either,
  getOtherDevices,
  getStringInverters
} from 'shared/utils'

import './OtherDevicesList.scss'

const isValid = properties => {
  if (Array.isArray(properties)) return properties
  return [{ PROGR: 0 }]
}
const getProgress = compose(
  Math.round,
  average,
  map(compose(Number, propOr('0', 'PROGR'))),
  isValid
)

const CommonLayout = ({ children, title, subtitle, onClick }) => {
  const t = useI18n()
  const clickHandler = event => {
    if (typeof onClick === 'function') return onClick(event)
  }

  return (
    <div className="common-layout">
      <div className="common-layout-content" onClick={clickHandler}>
        <div className="is-flex is-vertical tile">
          <span className="has-text-weight-bold mt-auto mb-auto">
            {t(title)}
          </span>
          <span>{t(subtitle)}</span>
        </div>
        <div className="has-text-right">{children}</div>
      </div>
    </div>
  )
}

/**
 *
 * @param {string}title
 * @param {number}progress
 * @param {string}subtitle
 * @returns {JSX.Element}
 * @constructor
 */
const ProgressBar = ({ title, progress, subtitle }) => {
  return (
    <CommonLayout title={title} subtitle={subtitle}>
      <CircularProgressbar
        value={progress}
        maxValue={100}
        text={`${Math.round(progress)}`}
        className={'discovery-progress-bar'}
      />
    </CommonLayout>
  )
}

export const RetryDiscovery = ({ devicesFound }) => {
  const t = useI18n()
  const rediscover = useRetryStringInverterDiscovery()
  return (
    <CommonLayout
      title={t('DISCOVERY_COMPLETE_OTHERDEVICES')}
      subtitle={t('DEVICES_FOUND', devicesFound)}
      onClick={rediscover}
    >
      <span className="has-text-primary sp-update is-size-2 rediscover-button" />
    </CommonLayout>
  )
}

export const DeviceFound = ({ name, onClick, numberFound, required }) => {
  return (
    <CommonLayout title={name} onClick={onClick}>
      <div className="is-flex discovery-item is-size-4">
        <span className="has-text-primary has-text-weight-bold">
          {numberFound}
        </span>
        {either(
          required,
          <span className="sp-chevron-right has-text-primary" />
        )}
      </div>
    </CommonLayout>
  )
}

const NothingToDoHere = ({ close, title }) => {
  const t = useI18n()
  return (
    <div className="is-flex tile is-vertical">
      <h1 className="has-text-white mb-10 has-text-weight-bold is-size-5">
        {title}
      </h1>
      <span className="mb-30 has-text-white">
        {t('THERES_NOTHING_TO_CONFIGURE_HERE')}
      </span>
      <button className="button is-primary" onClick={close}>
        {t('CONTINUE')}
      </button>
    </div>
  )
}

const ProgressModal = ({ close }) => {
  const t = useI18n()
  return (
    <div className="is-flex tile is-vertical">
      <span className="mb-30 has-text-white is-size-6 has-text-weight-bold is-uppercase">
        {t('ATTENTION')}
      </span>
      <span className="mb-30 has-text-white">{t('DISCOVERY_WAIT')}</span>
      <button className="button is-primary discover" onClick={close}>
        {t('CONTINUE')}
      </button>
    </div>
  )
}

const ConfigurePending = ({ close }) => {
  const t = useI18n()
  return (
    <div className="is-flex tile is-vertical">
      <span className="mb-30 has-text-white is-size-6 has-text-weight-bold is-uppercase">
        {t('ATTENTION')}
      </span>
      <span className="mb-30 has-text-white">{t('CONFIG_MISSING')}</span>
      <button className="button is-primary discover" onClick={close}>
        {t('CONTINUE')}
      </button>
    </div>
  )
}

const ignoredItems = ['PVS']
const requiredItems = {
  Inverter: true,
  'Met Station': false,
  'Power Meter': false
}

export const useStringInverterSelector = () =>
  useSelector(({ devices }) => {
    const found = prop('found', devices)
    const otherDevices = getOtherDevices(found)
    const groupedDevices =
      length(otherDevices) > 0
        ? omit(ignoredItems, groupBy(prop('DEVICE_TYPE'), otherDevices))
        : {}
    return {
      progress: getProgress(pathOr([{}], ['progress', 'progress'], devices)),
      discoveryComplete: pathOr(false, ['progress', 'complete'], devices),
      groupedDevices,
      devices: flatten(Object.values(groupedDevices))
    }
  })

const OtherDevicesList = () => {
  const history = useHistory()
  const t = useI18n()
  const [SwippableModalOpen, setSwippableModalOpen] = useState(false)

  const {
    progress,
    discoveryComplete,
    groupedDevices,
    devices
  } = useStringInverterSelector()
  const [currentModal, setCurrentModal] = useState({})

  const stringInverters = getStringInverters(devices)

  const closeModal = () => setSwippableModalOpen(false)

  return (
    <Template>
      <div className="is-flex tile is-vertical discovery-progress">
        {either(
          discoveryComplete,
          <RetryDiscovery devicesFound={devices.length} />,
          <ProgressBar
            title={t('STRING_INVERTER_DISCOVERY_IN_PROGRESS')}
            progress={progress}
          />
        )}
        {Object.entries(groupedDevices).map(([type, devices]) => {
          const required = prop(type, requiredItems)
          const number = either(
            required,
            stringInverters.length,
            devices.length
          )
          return (
            <DeviceFound
              key={type}
              name={type}
              numberFound={number}
              required={required}
              onClick={() => {
                if (discoveryComplete)
                  if (required)
                    return history.push(
                      paths.PROTECTED.CONFIGURE_STRING_INVERTER.path
                    )
                  else setCurrentModal({ type: 'NOTHING', title: type })
                else setCurrentModal({ type: 'PROGRESS' })
                setSwippableModalOpen(true)
              }}
            />
          )
        })}
        <SwipeableSheet
          open={SwippableModalOpen}
          onChange={() => setSwippableModalOpen(!SwippableModalOpen)}
        >
          {either(
            currentModal.type === 'PROGRESS',
            <ProgressModal close={closeModal} />
          )}
          {either(
            currentModal.type === 'NOTHING',
            <NothingToDoHere close={closeModal} title={currentModal.title} />
          )}
          {either(
            currentModal.type === 'CONFIGURE_PENDING',
            <ConfigurePending close={closeModal} />
          )}
        </SwipeableSheet>
      </div>
    </Template>
  )
}

export default OtherDevicesList
