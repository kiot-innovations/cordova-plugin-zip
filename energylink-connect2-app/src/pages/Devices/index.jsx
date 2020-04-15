import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { propOr, path, pathOr, length } from 'ramda'
import clsx from 'clsx'
import { useI18n } from 'shared/i18n'
import {
  DISCOVER_COMPLETE,
  FETCH_CANDIDATES_INIT,
  FETCH_CANDIDATES_COMPLETE,
  CLAIM_DEVICES_INIT,
  RESET_DISCOVERY
} from 'state/actions/devices'
import { SET_METADATA_INIT } from 'state/actions/pvs'
import Collapsible from 'components/Collapsible'
import paths from 'routes/paths'
import './Devices.scss'
import ProgressIndicators from './ProgressIndicators'
import useModal from 'hooks/useModal'

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

function mapStateToProps({ devices, pvs }) {
  const {
    discoveryComplete,
    candidates,
    found,
    claimingDevices,
    claimedDevices,
    claimError,
    error,
    progress
  } = devices
  const { serialNumbers } = pvs
  const { okMI, nonOkMI, pendingMI } = filterFoundMI(serialNumbers, candidates)
  return {
    claim: {
      claimingDevices,
      claimedDevices,
      claimError
    },
    progress,
    found: {
      otherDevices: found,
      discoveryComplete,
      error,
      inverter: [...okMI, ...nonOkMI, ...pendingMI]
    },
    counts: {
      inverter: {
        expected: length(serialNumbers),
        okMICount: length(okMI),
        errMICount: length(nonOkMI)
      }
    }
  }
}

const discoveryStatus = (
  found,
  counts,
  claim,
  claimDevices,
  t,
  retryDiscovery
) => {
  const discoveryComplete = found.discoveryComplete
  const errMICount = counts.inverter.errMICount
  const error = found.error

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

    if (claim.claimError) {
      return (
        <>
          <span className="has-text-weight-bold mb-20">
            {t('CLAIM_DEVICES_ERROR', claim.claimError)}
          </span>
          <Link
            className="button is-outlined is-primary is-uppercase is-paddingless ml-75 mr-75 mb-10"
            to={paths.PROTECTED.SN_LIST.path}
          >
            {t('ADD-DEVICES')}
          </Link>
          <button
            className={clsx(
              'button is-primary is-uppercase is-paddingless ml-75 mr-75',
              { 'is-loading': claim.claimingDevices }
            )}
            disabled={claim.claimingDevices}
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
            { 'is-loading': claim.claimingDevices }
          )}
          disabled={claim.claimingDevices}
          onClick={claimDevices}
        >
          {t('CLAIM_DEVICES')}
        </button>
      </>
    )
  } else {
    return (
      <span className="has-text-weight-bold mb-20">
        {claim.claimingDevices
          ? t('CLAIMING_DEVICES')
          : t('DISCOVERY_IN_PROGRESS')}
      </span>
    )
  }
}

const Devices = ({ animationState }) => {
  const { progress, found, counts, claim } = useSelector(mapStateToProps)
  const siteKey = useSelector(path(['site', 'site', 'siteKey']))
  const dispatch = useDispatch()
  const history = useHistory()
  const t = useI18n()

  const [modalSN, setModalSN] = useState('')
  const [modalErrorMsg, setModalErrorMsg] = useState('PING_ERROR')
  const [metadataObject, setMetadataObject] = useState()

  const modalTitle = (
    <span className="has-text-white has-text-weight-bold">
      {t('MI_STATUS', modalSN)}
    </span>
  )

  const modalContent = (
    <span className="has-text-white has-text-centered">{t(modalErrorMsg)}</span>
  )

  const { modal, toggleModal } = useModal(
    animationState,
    modalContent,
    modalTitle,
    false
  )

  const showMIStatusModal = (serialNumber, errorMsg) => {
    setModalSN(serialNumber)
    setModalErrorMsg(errorMsg)
    toggleModal()
  }

  useEffect(() => {
    if (animationState === 'enter') {
      dispatch(FETCH_CANDIDATES_INIT())
    }
    if (
      counts.inverter.expected ===
      counts.inverter.okMICount + counts.inverter.errMICount
    ) {
      dispatch(FETCH_CANDIDATES_COMPLETE())
    }
    if (claim.claimedDevices && animationState !== 'leave') {
      dispatch(SET_METADATA_INIT(metadataObject))
      history.push(paths.PROTECTED.INSTALL_SUCCESS.path)
    }
    return () => {
      if (animationState === 'exit') dispatch(DISCOVER_COMPLETE())
    }
  }, [
    dispatch,
    animationState,
    counts.expected,
    counts.okMICount,
    found.proceed,
    claim.claimedDevices,
    history,
    counts.inverter.expected,
    counts.inverter.okMICount,
    counts.inverter.errMICount,
    metadataObject
  ])

  const retryDiscovery = () => {
    dispatch(RESET_DISCOVERY())
    history.push(paths.PROTECTED.SN_LIST.path)
  }

  const validateModels = () => {
    const filterModels = propOr([], 'inverter', found).filter(
      mi => !mi.modelStr
    )
    if (filterModels.length > 0) {
      bulkEditModel()
    } else {
      claimDevices()
    }
  }

  const claimDevices = () => {
    const claimObject = path(['inverter'], found).map(mi => {
      mi.OPERATION = 'add'
      return mi
    })
    const metadataObject = {
      metaData: {
        site_key: siteKey,
        devices: [...found.otherDevices, ...claimObject]
      }
    }
    setMetadataObject(metadataObject)
    dispatch(CLAIM_DEVICES_INIT(claimObject))
  }

  const bulkEditModel = () => {
    history.push(paths.PROTECTED.MODEL_EDIT.path)
  }

  const miActions = (num = 0, max = 0, icon = '') => (
    <div className="is-flex">
      <span
        onClick={bulkEditModel}
        className={clsx(icon, 'mr-10 ml-0 mt-0 mb-0')}
      />
      <span className="devices-counter mr-10 ml-0 mt-0 mb-0">{`${num}/${max}`}</span>
    </div>
  )

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
          actions={miActions(
            counts.inverter.okMICount,
            length(propOr([], 'inverter', found)),
            'sp-gear'
          )}
        >
          <ul className="equipment-list">
            {propOr([], 'inverter', found).map(elem => {
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
                      <span className="has-text-weight-bold ml-10">
                        {elem.miType}
                      </span>
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
      {discoveryStatus(found, counts, claim, validateModels, t, retryDiscovery)}
    </div>
  )
}

export default Devices
