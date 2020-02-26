import Collapsible from 'components/Collapsible'
import { pathOr, propOr, length, filter, propEq } from 'ramda'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import paths from 'routes/paths'
import { useI18n } from 'shared/i18n'
import {
  DISCOVER_COMPLETE,
  FETCH_CANDIDATES_INIT,
  DISCOVER_INIT
} from 'state/actions/devices'
import './Devices.scss'

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

const filterFoundPVS = (SNList, candidatesList) => {
  const okPVS = []
  const nonOkPVS = []
  SNList.forEach(device => {
    try {
      const foundCandidate = candidatesList.find(
        item => item.SERIAL === device.serial_number
      )

      if (foundCandidate && foundCandidate.STATEDESCR.toLowerCase() === 'ok') {
        device.state = foundCandidate.STATEDESCR
        okPVS.push(device)
      } else {
        device.state = foundCandidate.STATEDESCR
        nonOkPVS.push(device)
      }
    } catch (e) {
      console.error('Filtering error', e)
    }
  })

  return { proceed: length(SNList) === length(okPVS), okPVS, nonOkPVS }
}

function mapStateToProps({ inventory, devices, pvs }) {
  const { candidates, found } = devices
  const { serialNumbers } = pvs
  const { bom } = inventory
  const expectedMIs = serialNumbers.map(({ model, ...keepAttrs }) => keepAttrs)
  const { proceed, okPVS, nonOkPVS } = filterFoundPVS(expectedMIs, candidates)

  const inverterCount = filter(propEq('item', 'MODULES'), bom)
  const meterCount = filter(propEq('item', 'METERS'), bom)
  return {
    inventory: {
      inverters: pathOr(0, ['value'], inverterCount),
      meter: pathOr(0, ['value'], meterCount)
    },
    found: {
      ...found,
      proceed,
      inverter: [...okPVS, ...nonOkPVS]
    },
    counts: {
      inverter: {
        okPVSCount: length(okPVS),
        errPVSCount: length(nonOkPVS)
      }
    }
  }
}

const Devices = ({ animationState }) => {
  const { found, counts } = useSelector(mapStateToProps)
  const dispatch = useDispatch()
  const t = useI18n()
  useEffect(() => {
    dispatch(FETCH_CANDIDATES_INIT())
    return () => {
      if (animationState === 'exit') dispatch(DISCOVER_COMPLETE())
    }
  }, [dispatch, animationState])
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
            counts.inverter.okPVSCount,
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
      {found.proceed ? (
        <Link
          className="button is-primary is-uppercase is-paddingless ml-75 mr-75"
          to={paths.PROTECTED.INSTALL_SUCCESS.path}
        >
          {t('DONE')}
        </Link>
      ) : (
        <span className="has-text-weight-bold mb-20">
          {t('DEVICES_NOT_FOUND')}
        </span>
      )}
    </div>
  )
}

export default Devices
