import clsx from 'clsx'
import { length, pathOr } from 'ramda'
import React, { useState } from 'react'

import Collapsible from 'components/Collapsible'
import ColoredBanner, { bannerCategories } from 'components/ColoredBanner'
import useModal from 'hooks/useModal'
import ProgressIndicators from 'pages/Devices/ProgressIndicators'
import { useI18n } from 'shared/i18n'
import { either, miTypes } from 'shared/utils'
import 'pages/Devices/Devices.scss'

const microInverterIcon = (
  <span className="sp-inverter mr-20 devices-icon ml-0 mt-0 mb-0" />
)

const miIndicators = {
  MI_OK: <span className="is-size-4 mr-10 sp-check has-text-white" />,
  ERROR: <span className="is-size-4 mr-10 sp-hey has-text-primary" />,
  LOADING: (
    <div className="inline-loader">
      <div className="ball-scale-ripple">
        <div />
      </div>
    </div>
  )
}

const discoveryStatus = (
  error,
  expected,
  okMICount,
  errMICount,
  claimError,
  claimingDevices,
  claimDevices,
  t,
  discoveryComplete,
  retryDiscovery,
  claimFoundMI
) => {
  if (expected === okMICount + errMICount && discoveryComplete) {
    if (errMICount === expected) {
      return (
        <>
          <span className="has-text-weight-bold mt-10 mb-20">
            {t('MI_ERRORS_ALL')}
          </span>
          <button
            className="button is-primary is-uppercase is-paddingless ml-75 mr-75"
            onClick={retryDiscovery}
          >
            {t('RETRY')}
          </button>
        </>
      )
    }
    if (errMICount > 0) {
      return (
        <>
          <div className="has-text-centered is-flex flex-column mb-10">
            <span className="has-text-weight-bold has-text-white">
              {errMICount > 1
                ? t('RMA_MI_ERROR', errMICount)
                : t('RMA_MI_ERROR_SINGLE')}
            </span>
            <span className="has-text-weight-bold">
              {t('RMA_MI_ERROR_CONTINUE')}
            </span>
          </div>
          <div className="inline-buttons">
            <button
              className="button is-primary is-uppercase is-outlined"
              onClick={retryDiscovery}
            >
              {t('RETRY')}
            </button>
            <button
              className={clsx('button is-primary is-uppercase', {
                'is-loading': claimingDevices
              })}
              disabled={claimingDevices}
              onClick={claimFoundMI}
            >
              {t('CONTINUE')}
            </button>
          </div>
        </>
      )
    }

    if (error) {
      return (
        <>
          <span className="has-text-weight-bold mt-10 mb-20">
            {t('CLAIMING_MIS_ERROR')}
          </span>
          <button
            className="button is-primary is-uppercase is-paddingless ml-75 mr-75"
            onClick={retryDiscovery}
          >
            {t('RETRY')}
          </button>
        </>
      )
    }

    if (claimError) {
      return (
        <>
          <span className="has-text-weight-bold mb-20">
            {t('CLAIM_DEVICES_ERROR', claimError)}
          </span>
          <button
            className="button is-primary is-outlined is-uppercase is-paddingless ml-75 mr-75 mb-10"
            disabled={claimingDevices}
            onClick={retryDiscovery}
          >
            {t('ADD_DEVICES')}
          </button>
          <button
            className="button is-primary is-uppercase ml-75 mr-75"
            onClick={retryDiscovery}
          >
            {t('RETRY')}
          </button>
        </>
      )
    }

    return (
      <>
        <div className="inline-buttons">
          <button
            className="button is-primary is-outlined is-uppercase"
            disabled={claimingDevices}
            onClick={retryDiscovery}
          >
            {t('ADD_DEVICES')}
          </button>
          <button
            className={clsx('button is-primary is-uppercase', {
              'is-loading': claimingDevices
            })}
            disabled={claimingDevices}
            onClick={claimDevices}
          >
            {t('CLAIM_DEVICES')}
          </button>
        </div>
      </>
    )
  } else {
    return error ? (
      <>
        <span className="has-text-weight-bold mt-20">
          {t('DISCOVERY_ERROR')}
        </span>
        <button
          className="button is-primary is-uppercase is-paddingless ml-75 mr-75"
          onClick={retryDiscovery}
        >
          {t('RETRY')}
        </button>
      </>
    ) : (
      <span className="has-text-weight-bold mb-20">
        {claimingDevices ? t('CLAIMING_DEVICES') : t('DISCOVERY_IN_PROGRESS')}
      </span>
    )
  }
}

const miActions = (num = 0, max = 0, icon = '') => (
  <div>
    <span className="devices-counter mr-10 ml-0 mt-0 mb-0">{`${num}/${max}`}</span>
  </div>
)

function RMAMiDiscoveryUI({
  claimingDevices,
  claimError,
  error,
  progress,
  discoveryComplete,
  retryDiscovery,
  claimDevices,
  inverter,
  okMICount,
  errMICount,
  expected,
  claimFoundMI,
  areOnboardMetersMissing
}) {
  const t = useI18n()

  const [modalSN, setModalSN] = useState('')
  const [modalErrorMsg, setModalErrorMsg] = useState('PING_ERROR')

  const modalTitle = (
    <span className="has-text-white has-text-weight-bold">
      {t('MI_STATUS', modalSN)}
    </span>
  )

  const modalContent = (
    <span className="has-text-white has-text-centered">{t(modalErrorMsg)}</span>
  )

  const { modal, toggleModal } = useModal(modalContent, modalTitle, false)

  const showMIStatusModal = (serialNumber, errorMsg) => {
    setModalSN(serialNumber)
    setModalErrorMsg(errorMsg)
    toggleModal()
  }

  return (
    <div className="fill-parent is-flex tile is-vertical has-text-centered sunpower-devices pr-15 pl-15">
      {modal}
      <span className="is-uppercase has-text-weight-bold mb-20" role="button">
        {t('DEVICES')}
      </span>
      {either(
        areOnboardMetersMissing,
        <ColoredBanner
          category={bannerCategories.ERROR}
          text={t('METERS_NOT_FOUND')}
          actionText={t('RETRY_DISCOVERY')}
          action={retryDiscovery}
          className="mb-15"
        />
      )}
      <div className="pb-15">
        <Collapsible
          title={t('MICROINVERTERS')}
          icon={microInverterIcon}
          expanded
          actions={miActions(okMICount, length(inverter), 'sp-gear')}
        >
          <ul className="equipment-list">
            {inverter.map(elem => {
              return (
                <li
                  className="equipment-piece is-flex flow-wrap tile"
                  key={elem.serial_number}
                >
                  <div className="is-flex is-vertical has-text-white tile">
                    <span>
                      <span className="has-text-weight-bold has-text-white">
                        SN:
                      </span>
                      {elem.serial_number}
                      {either(
                        elem.indicator === 'MI_OK',
                        <span className="has-text-weight-bold ml-10">
                          {miTypes[elem.MODEL] || ''}
                        </span>
                      )}
                    </span>
                    {elem.modelStr ? (
                      <span>{elem.modelStr}</span>
                    ) : (
                      <span>{t('NO_MODEL')}</span>
                    )}
                  </div>
                  <div
                    className="mi-indicator is-flex"
                    onClick={() =>
                      showMIStatusModal(elem.serial_number, elem.STATEDESCR)
                    }
                  >
                    {miIndicators[elem.indicator]}
                  </div>
                </li>
              )
            })}
          </ul>
        </Collapsible>
        <ProgressIndicators progressList={pathOr([], ['progress'], progress)} />
      </div>
      {discoveryStatus(
        error,
        expected,
        okMICount,
        errMICount,
        claimError,
        claimingDevices,
        claimDevices,
        t,
        discoveryComplete,
        retryDiscovery,
        claimFoundMI
      )}
    </div>
  )
}

export default RMAMiDiscoveryUI
