import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  always,
  cond,
  equals,
  has,
  isEmpty,
  pathOr,
  prop,
  propOr,
  T
} from 'ramda'
import { useI18n } from 'shared/i18n'
import { roundDecimals } from 'shared/rounding'
import {
  ENERGY_DATA_START_POLLING,
  ENERGY_DATA_STOP_POLLING
} from 'state/actions/energy-data'
import { RUN_EQS_SYSTEMCHECK_SUCCESS } from 'state/actions/storage'
import { MI_DATA_START_POLLING, MI_DATA_STOP_POLLING } from 'state/actions/pvs'
import { FETCH_DEVICES_LIST } from 'state/actions/devices'
import { either } from 'shared/utils'
import EnergyGraphSection from './EnergyGraphSection'
import RightNow from 'components/RightNow'
import MiDataLive from 'components/MiDataLive'
import Collapsible from 'components/Collapsible'
import { ButtonLink } from 'components/ButtonLink'
import paths from 'routes/paths'
import './Data.scss'

export default () => {
  const t = useI18n()
  const dispatch = useDispatch()
  const { liveData = {} } = useSelector(state => state.energyLiveData)
  const { miData } = useSelector(state => state.pvs)
  const storageStatus = useSelector(pathOr({}, ['storage', 'status']))
  const essState = pathOr({}, ['results', 'ess_report', 'ess_state', 0])(
    storageStatus
  )

  const essDisplayStatus = cond([
    [s => s.permission_to_operate, always('CONTROLLER RUNNING NORMALLY')],
    [
      s => equals('RUNNING', s.storage_controller_status),
      always('CONTROLLER IN PRE-PTO MODE')
    ],
    [
      s => equals('NOT_RUNNING', s.storage_controller_status),
      always('CONTROLLER NOT RUNNING')
    ],
    [T, always('CONTROLLER_DATA_ERROR')]
  ])

  useEffect(() => {
    dispatch(FETCH_DEVICES_LIST())
    dispatch(ENERGY_DATA_START_POLLING())
    dispatch(MI_DATA_START_POLLING())
    dispatch(RUN_EQS_SYSTEMCHECK_SUCCESS())
    return () => {
      dispatch(ENERGY_DATA_STOP_POLLING())
      dispatch(MI_DATA_STOP_POLLING())
    }
  }, [dispatch])

  let data = {
    solar: 0,
    stateOfCharge: 0,
    storage: 0,
    grid: 0,
    date: new Date(),
    homeUsage: 0,
    rawData: {}
  }

  const entries = Object.entries(liveData)
  if (entries.length) {
    const [latestDate, latest] = entries[entries.length - 1]
    data = {
      date: latestDate,
      stateOfCharge: latest.soc,
      grid: roundDecimals(latest.c - latest.p - latest.s),
      rawData: latest.rawData
    }
  }

  const hasStorage = has('soc', data.rawData)
  const consumptionValue = has('site_load_p', data.rawData)
    ? prop('site_load_p', data.rawData)
    : propOr(0, 'powerHomeUsage', data)

  const powerValues = {
    home: roundDecimals(consumptionValue),
    solar: roundDecimals(propOr(0, 'pv_p', data.rawData)),
    grid: roundDecimals(propOr(0, 'net_p', data.rawData)),
    storage: roundDecimals(propOr(0, 'ess_p', data.rawData)),
    soc: propOr(0, 'soc', data.rawData) * 100
  }

  return (
    <section className="data is-flex has-text-centered full-height pl-10 pr-10">
      <section>
        {either(
          hasStorage,
          <Collapsible title={t('SUNVAULT_STATUS')}>
            <span className="has-text-weight-bold has-text-white mt-10 mb-10">
              {either(
                !isEmpty(essState),
                <span>
                  {storageStatus.error
                    ? t('EQS_ERROR')
                    : t(essDisplayStatus(essState))}
                </span>,
                <span className="loader-label">{t('LOADING')}</span>
              )}
            </span>
            <ButtonLink
              title={t('HEALTH_CHECK')}
              path={paths.PROTECTED.ESS_HEALTH_CHECK.path}
            />
          </Collapsible>
        )}
        {either(miData, <MiDataLive data={miData} />)}
      </section>
      <section>
        <h6 className="is-uppercase mt-20 mb-20">{t('RIGHT_NOW')}</h6>
        <RightNow
          solarValue={powerValues.solar}
          gridValue={powerValues.grid}
          hasStorage={hasStorage}
          storageValue={powerValues.storage}
          homeValue={powerValues.home}
          batteryLevel={powerValues.soc}
        />
      </section>
      <div className="separator" />
      <EnergyGraphSection />
    </section>
  )
}
