import Collapsible from 'components/Collapsible'
import { propOr, length, path, pathOr } from 'ramda'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import paths from 'routes/paths'
import { useI18n } from 'shared/i18n'
import { Loader } from 'components/Loader'
import {
  DISCOVER_COMPLETE,
  FETCH_CANDIDATES_INIT,
  DISCOVER_INIT,
  FETCH_CANDIDATES_COMPLETE,
  CLAIM_DEVICES_INIT,
  RESET_DISCOVERY
} from 'state/actions/devices'
import './Devices.scss'

const microInverterIcon = (
  <span className="sp-inverter mr-20 devices-icon ml-0 mt-0 mb-0" />
)

const Icon = (num = 0, max = 0, icon = '') => (
  <div className="is-flex">
    <span className={`${icon} mr-10 ml-0 mt-0 mb-0`} />
    <span className="devices-counter mr-10 ml-0 mt-0 mb-0">{`${num}/${max}`}</span>
  </div>
)

const miStates = {
  NEW: 'LOADING',
  PINGING: 'LOADING',
  PING_OK: 'LOADING',
  PING_ERROR: 'ERROR',
  GETTING_VERSION_INFORMATION: 'LOADING',
  VERSION_INFORMATION_OK: 'LOADING',
  VERSION_INFORMATION_ERROR: 'ERROR',
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
      const deviceCopy = device
      const foundCandidate = candidatesList.find(
        item => item.SERIAL === deviceCopy.serial_number
      )
      if (foundCandidate) {
        deviceCopy.state = foundCandidate.STATEDESCR
        deviceCopy.indicator = miStates[deviceCopy.state]
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
        deviceCopy.state = miStates.PINGING
        deviceCopy.indicator = 'LOADING'
        pendingMI.push(deviceCopy)
      }
    } catch (e) {
      console.error('Filtering error', e)
    }
  })

  return {
    proceed: length(SNList) === length(okMI),
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
    error,
    progress
  } = devices
  const { serialNumbers } = pvs
  const { proceed, okMI, nonOkMI, pendingMI } = filterFoundMI(
    serialNumbers,
    candidates
  )
  return {
    claim: {
      claimingDevices,
      claimedDevices
    },
    progress,
    found: {
      ...found,
      proceed,
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

const Devices = ({ animationState }) => {
  const { progress, found, counts, claim } = useSelector(mapStateToProps)
  const dispatch = useDispatch()
  const history = useHistory()
  const t = useI18n()

  useEffect(() => {
    dispatch(FETCH_CANDIDATES_INIT())
    if (found.proceed) {
      dispatch(FETCH_CANDIDATES_COMPLETE())
    }
    if (claim.claimedDevices && animationState !== 'leave') {
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
    history
  ])

  const retryDiscovery = () => {
    dispatch(RESET_DISCOVERY())
    history.push(paths.PROTECTED.SN_LIST.path)
  }

  const claimDevices = () => {
    const claimObject = path(['inverter'], found).map(mi => {
      return {
        OPERATION: 'add',
        MODEL: 'AC_Module_Type_E',
        SERIAL: mi.serial_number,
        TYPE: 'SOLARBRIDGE'
      }
    })
    dispatch(CLAIM_DEVICES_INIT(JSON.stringify(claimObject)))
  }

  const progressIndicators = () => {
    const progressMap = pathOr([], ['progress'], progress).map(deviceType => {
      if (deviceType.TYPE !== 'MicroInverters')
        return (
          <Collapsible
            title={deviceType.TYPE}
            icon={
              deviceType.PROGR !== '100'
                ? miIndicators.LOADING
                : miIndicators.OK
            }
            actions={
              deviceType.PROGR !== '100'
                ? deviceType.PROGR + '%'
                : deviceType.NFOUND + ' Found'
            }
            expandable={false}
          />
        )
    })
    return progressMap
  }
  return (
    <div className="fill-parent is-flex tile is-vertical has-text-centered sunpower-devices pr-15 pl-15">
      <span className="is-uppercase has-text-weight-bold mb-20" role="button">
        {t('DEVICES')}
      </span>
      <span
        className="is-uppercase mb-20 has-text-primary"
        onClick={() => dispatch(DISCOVER_INIT())}
      >
        {t('RESCAN')}
      </span>
      <div className="pb-15">
        <Collapsible
          title={t('MICRO-INVERTERS')}
          icon={microInverterIcon}
          expanded
          actions={Icon(
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
                    </span>
                    {elem.model ? (
                      <span>{elem.model}</span>
                    ) : (
                      <span>{t('RETRIEVING_MODEL')}</span>
                    )}
                  </div>
                  {miIndicators[elem.indicator]}
                </li>
              )
            })}
          </ul>
        </Collapsible>
        {progressIndicators()}
      </div>
      {found.discoveryComplete && (
        <Link
          className="button is-outlined is-primary is-uppercase is-paddingless ml-75 mr-75 mb-10"
          to={paths.PROTECTED.SN_LIST.path}
        >
          {t('ADD-DEVICES')}
        </Link>
      )}
      {!found.error && !found.discoveryComplete ? (
        <div>
          <Loader />
          <span className="has-text-weight-bold mb-20">
            {claim.claimingDevices
              ? t('CLAIMING_DEVICES')
              : t('DISCOVERY_IN_PROGRESS')}
          </span>
        </div>
      ) : (
        ''
      )}
      {found.error && (
        <>
          <button
            className="button is-primary is-uppercase is-paddingless ml-75 mr-75"
            onClick={retryDiscovery}
          >
            {t('RETRY')}
          </button>
          <span className="has-text-weight-bold mt-20">{t(found.error)}</span>
        </>
      )}
      {found.discoveryComplete && (
        <button
          className="button is-primary is-uppercase is-paddingless ml-75 mr-75"
          onClick={claimDevices}
        >
          {t('DONE')}
        </button>
      )}
    </div>
  )
}

export default Devices
