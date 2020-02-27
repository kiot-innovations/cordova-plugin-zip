import Collapsible from 'components/Collapsible'
import { propOr, length, path } from 'ramda'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import clsx from 'clsx'
import paths from 'routes/paths'
import { useI18n } from 'shared/i18n'
import {
  DISCOVER_COMPLETE,
  FETCH_CANDIDATES_INIT,
  DISCOVER_INIT,
  FETCH_CANDIDATES_COMPLETE,
  CLAIM_DEVICES_INIT
} from 'state/actions/devices'
import './Devices.scss'
import { Loader } from 'components/Loader'

const microInverterIcon = (
  <span className="sp-inverter mr-20 devices-icon ml-0 mt-0 mb-0" />
)
const meterIcon = <span className="mr-20 sp-meter ml-0 mt-0 mb-0" />
const Icon = (num = 0, max = 0, icon = '') => (
  <div className="is-flex">
    <span className={`${icon} mr-10 ml-0 mt-0 mb-0`} />
    <span className="devices-counter mr-10 ml-0 mt-0 mb-0">{`${num}/${max}`}</span>
  </div>
)
const numberItems = num =>
  num !== 0 && (
    <span className="devices-counter mr-10 ml-0 mt-0 mb-0">{num}</span>
  )

const filterFoundMI = (SNList, candidatesList) => {
  const okMI = []
  const nonOkMI = []
  SNList.forEach(device => {
    try {
      const foundCandidate = candidatesList.find(
        item => item.SERIAL === device.serial_number
      )
      if (foundCandidate && foundCandidate.STATEDESCR.toLowerCase() === 'ok') {
        device.state = foundCandidate.STATEDESCR
        okMI.push(device)
      } else {
        device.state = 'Not Found'
        nonOkMI.push(device)
      }
    } catch (e) {
      console.error('Filtering error', e)
    }
  })

  return { proceed: length(SNList) === length(okMI), okMI, nonOkMI }
}

function mapStateToProps({ devices, pvs }) {
  const {
    discoveryComplete,
    candidates,
    found,
    claimingDevices,
    claimedDevices,
    fetchCandidatesError
  } = devices
  const { serialNumbers } = pvs
  const { proceed, okMI, nonOkMI } = filterFoundMI(serialNumbers, candidates)
  return {
    claim: {
      claimingDevices,
      claimedDevices
    },
    found: {
      ...found,
      proceed,
      discoveryComplete,
      fetchCandidatesError,
      inverter: [...okMI, ...nonOkMI]
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
  const { found, counts, claim } = useSelector(mapStateToProps)
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
    if (found.fetchCandidatesError && animationState !== 'leave') {
      history.push(paths.PROTECTED.SN_LIST.path)
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
    found.fetchCandidatesError
  ])

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
                      <span>
                        {elem.model} <span className="sp-pencil is-gray" />
                      </span>
                    ) : (
                      ''
                    )}
                  </div>
                  <span
                    className={clsx('is-size-4 mr-10', {
                      'sp-check has-text-white': elem.state === 'OK',
                      'sp-hey has-text-primary': elem.state !== 'OK'
                    })}
                  />
                </li>
              )
            })}
          </ul>
        </Collapsible>
      </div>
      <div className="pb-15">
        <Collapsible
          title={t('METERS')}
          actions={numberItems(length(propOr([], 'power meter', found)))}
          icon={meterIcon}
        >
          <ul className="equipment-list">
            {propOr([], 'power meter', found).map(elem => {
              return (
                <li className="equipment-piece is-flex flow-wrap tile">
                  <div className="is-flex is-vertical has-text-white tile">
                    <span>
                      <span className="has-text-weight-bold has-text-white">
                        SN:
                      </span>
                      {elem.SERIAL}
                    </span>
                  </div>
                </li>
              )
            })}
          </ul>
        </Collapsible>
      </div>
      <Link
        className="button is-outlined is-primary is-uppercase is-paddingless ml-75 mr-75 mb-10"
        to={paths.PROTECTED.SN_LIST.path}
      >
        {t('ADD-DEVICES')}
      </Link>
      {found.discoveryComplete ? (
        <button
          className="button is-primary is-uppercase is-paddingless ml-75 mr-75"
          onClick={claimDevices}
        >
          {t('DONE')}
        </button>
      ) : (
        <div>
          <Loader />
          <span className="has-text-weight-bold mb-20">
            {claim.claimingDevices
              ? t('CLAIMING_DEVICES')
              : t('DISCOVERY_IN_PROGRESS')}
          </span>
        </div>
      )}
    </div>
  )
}

export default Devices
