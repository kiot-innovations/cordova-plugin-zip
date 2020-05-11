import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import useModal from 'hooks/useModal'
import { length, pathOr } from 'ramda'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { either } from 'shared/utils'
import { useI18n } from 'shared/i18n'
import {
  CLAIM_DEVICES_INIT,
  DISCOVER_COMPLETE,
  FETCH_CANDIDATES_COMPLETE,
  FETCH_CANDIDATES_INIT,
  RESET_DISCOVERY,
  FETCH_DEVICES_LIST
} from 'state/actions/devices'
import paths from 'routes/paths'
import Collapsible from 'components/Collapsible'
import ProgressIndicators from './ProgressIndicators'

import './Devices.scss'

const microInverterIcon = (
  <span className="sp-inverter mr-20 devices-icon ml-0 mt-0 mb-0" />
)

const miStates = {
  NEW: 'LOADING',
  PINGING: 'LOADING',
  PING_OK: 'LOADING',
  PING_ERROR: 'ERROR',
  GETTING_VERSION_INFORMATION: 'LOADING',
  VERSION_INFORMATION_OK: 'LOADING',
  VERSION_INFORMATION_ERROR: 'ERROR',
  INVALID_SERIAL_NUMBER: 'ERROR',
  GETTING_PLC_STATS: 'LOADING',
  PLC_STATS_OK: 'LOADING',
  PLC_STATS_ERROR: 'ERROR',
  GETTING_PV_INFO: 'LOADING',
  PV_INFO_OK: 'LOADING',
  PV_INFO_ERROR: 'ERROR',
  OK: 'OK'
}

const miIndicators = {
  OK: <span className="is-size-4 mr-10 sp-check has-text-white" />,
  ERROR: <span className="is-size-4 mr-10 sp-hey has-text-primary" />,
  LOADING: (
    <div className="inline-loader">
      <div className="ball-scale-ripple">
        <div />
      </div>
    </div>
  )
}
const filterFoundMI = (SNList, candidatesList) => {
  const okMI = []
  const nonOkMI = []
  const pendingMI = []
  SNList.forEach(device => {
    try {
      let deviceCopy = device
      const foundCandidate = candidatesList.find(
        item => item.SERIAL === deviceCopy.serial_number
      )
      if (foundCandidate) {
        deviceCopy = { ...deviceCopy, ...foundCandidate }
        deviceCopy.indicator = miStates[deviceCopy.STATEDESCR]
        if (deviceCopy.indicator === 'OK') {
          okMI.push(deviceCopy)
        } else {
          if (deviceCopy.indicator === 'LOADING') {
            pendingMI.push(deviceCopy)
          } else {
            if (deviceCopy.indicator === 'ERROR') {
              nonOkMI.push(deviceCopy)
            }
          }
        }
      } else {
        deviceCopy.STATEDESCR = miStates.PINGING
        deviceCopy.indicator = 'LOADING'
        pendingMI.push(deviceCopy)
      }
    } catch (e) {
      console.error('Filtering error', e)
    }
  })

  return {
    okMI,
    nonOkMI,
    pendingMI
  }
}

const discoveryStatus = (
  error,
  discoveryComplete,
  errMICount,
  claimError,
  claimingDevices,
  claimDevices,
  t,
  retryDiscovery
) => {
  if (discoveryComplete) {
    if (errMICount > 0) {
      return (
        <>
          <button
            className="button is-primary is-uppercase is-paddingless ml-75 mr-75"
            onClick={retryDiscovery}
          >
            {t('RETRY')}
          </button>
          <span className="has-text-weight-bold mt-20">{t('MI_ERRORS')}</span>
        </>
      )
    }

    if (error) {
      return (
        <>
          <button
            className="button is-primary is-uppercase is-paddingless ml-75 mr-75"
            onClick={retryDiscovery}
          >
            {t('RETRY')}
          </button>
          <span className="has-text-weight-bold mt-20">{t(error)}</span>
        </>
      )
    }

    if (claimError) {
      return (
        <>
          <span className="has-text-weight-bold mb-20">
            {t('CLAIM_DEVICES_ERROR', claimError)}
          </span>
          <Link
            className="button is-outlined is-primary is-uppercase is-paddingless ml-75 mr-75 mb-10"
            to={paths.PROTECTED.SN_LIST.path}
          >
            {t('ADD-DEVICES')}
          </Link>
          <button
            className={clsx('button is-primary is-uppercase ml-75 mr-75', {
              'is-loading': claimingDevices
            })}
            disabled={claimingDevices}
            onClick={claimDevices}
          >
            {t('CLAIM_DEVICES')}
          </button>
        </>
      )
    }

    return (
      <>
        <Link
          className="button is-outlined is-primary is-uppercase is-paddingless ml-75 mr-75 mb-10"
          to={paths.PROTECTED.SN_LIST.path}
        >
          {t('ADD-DEVICES')}
        </Link>
        <button
          className={clsx(
            'button is-primary is-uppercase is-paddingless ml-75 mr-75',
            { 'is-loading': claimingDevices }
          )}
          disabled={claimingDevices}
          onClick={claimDevices}
        >
          {t('CLAIM_DEVICES')}
        </button>
      </>
    )
  } else {
    return (
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

function Devices() {
  const dispatch = useDispatch()
  const history = useHistory()
  const t = useI18n()

  const { serialNumbers } = useSelector(state => state.pvs)

  const {
    discoveryComplete,
    candidates,
    claimingDevices,
    claimedDevices,
    claimError,
    error,
    progress
  } = useSelector(state => state.devices)

  const { okMI, nonOkMI, pendingMI } = filterFoundMI(serialNumbers, candidates)

  const inverter = [...okMI, ...nonOkMI, ...pendingMI]
  const expected = length(serialNumbers)
  const okMICount = length(okMI)
  const errMICount = length(nonOkMI)

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

  useEffect(() => {
    dispatch(FETCH_CANDIDATES_INIT())
    return () => {
      console.warn('unmounting component')
      dispatch(DISCOVER_COMPLETE())
    }
  }, [dispatch])

  useEffect(() => {
    if (expected === okMICount + errMICount) {
      dispatch(FETCH_CANDIDATES_COMPLETE())
    }
  }, [errMICount, expected, okMICount, dispatch])

  useEffect(() => {
    if (claimedDevices) {
      dispatch(FETCH_DEVICES_LIST())
      history.push(paths.PROTECTED.MODEL_EDIT.path)
    }
  }, [claimedDevices, dispatch, history])

  const retryDiscovery = () => {
    dispatch(RESET_DISCOVERY())
    history.push(paths.PROTECTED.SN_LIST.path)
  }

  const claimDevices = () => {
    const claimObject = inverter.map(mi => {
      mi.OPERATION = 'add'
      return mi
    })
    dispatch(CLAIM_DEVICES_INIT(claimObject))
  }

  console.warn('This is a render')

  return (
    <div className="fill-parent is-flex tile is-vertical has-text-centered sunpower-devices pr-15 pl-15">
      {modal}
      <span className="is-uppercase has-text-weight-bold mb-20" role="button">
        {t('DEVICES')}
      </span>
      <div className="pb-15">
        <Collapsible
          title={t('MICRO-INVERTERS')}
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
                        elem.indicator === 'OK',
                        <span className="has-text-weight-bold ml-10">
                          {elem.miType}
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
        discoveryComplete,
        errMICount,
        claimError,
        claimingDevices,
        claimDevices,
        t,
        retryDiscovery
      )}
    </div>
  )
}

export default Devices
