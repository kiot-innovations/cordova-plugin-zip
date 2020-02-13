import React, { useEffect } from 'react'
import './Data.scss'
import { useDispatch, useSelector } from 'react-redux'
import RightNow from '../../components/RightNow'
import EnergyMix from '../../components/EnergyMix'
import { useI18n } from '../../shared/i18n'
import { roundDecimals } from '../../shared/rounding'
import {
  ENERGY_DATA_START_POLLING,
  ENERGY_DATA_STOP_POLLING
} from '../../state/actions/energy-data'
import EnergyGraphSection from './EnergyGraphSection'

export default () => {
  const t = useI18n()
  const dispatch = useDispatch()
  const { liveData = {} } = useSelector(state => state.energyLiveData)

  useEffect(() => {
    dispatch(ENERGY_DATA_START_POLLING())
  }, [dispatch])

  useEffect(() => {
    return () => dispatch(ENERGY_DATA_STOP_POLLING())
  }, [dispatch])

  let data = {
    solar: 0,
    stateOfCharge: 0,
    storage: 0,
    grid: 0,
    date: new Date(),
    homeUsage: 0
  }

  const entries = Object.entries(liveData)

  if (entries.length) {
    const [latestDate, latest] = entries[entries.length - 1]
    data = {
      date: latestDate,
      stateOfCharge: latest.soc,
      solar: latest.p,
      storage: latest.s,
      homeUsage: latest.c,
      grid: roundDecimals(latest.c - latest.p - latest.s),
      powerSolar: latest.pp,
      powerStorage: latest.ps,
      powerHomeUsage: latest.pc,
      powerGrid: roundDecimals(latest.pc - latest.pp - latest.ps)
    }
  }

  return (
    <section className="data is-flex has-text-centered full-height">
      <section>
        <h6 className="is-uppercase mt-20 mb-20">{t('RIGHT_NOW')}</h6>
        <RightNow
          solarValue={data.powerSolar}
          gridValue={data.powerGrid}
          hasStorage={true}
          storageValue={data.powerStorage}
          homeValue={data.powerHomeUsage}
          batteryLevel={data.stateOfCharge}
        />
      </section>
      <div className="separator" />
      <EnergyGraphSection />
      <section>
        <h6 className="is-uppercase mt-20 mb-20">{t('ENERGY_MIX')}</h6>
        <EnergyMix {...data} hasStorage={true} />
      </section>
    </section>
  )
}
