import React, { useEffect } from 'react'
import './Data.scss'
import { useDispatch, useSelector } from 'react-redux'
import EnergyGraph, { VIEWS } from '../../components/EnergyGraph'
import RightNow from '../../components/RightNow'
import EnergyMix from '../../components/EnergyMix'
import { useI18n } from '../../shared/i18n'
import { roundDecimals } from '../../shared/rounding'
import { startPolling } from '../../state/actions/energy-data'

export default () => {
  const t = useI18n()
  const dispatch = useDispatch()
  const { liveData = {} } = useSelector(state => state.energyLiveData)

  useEffect(() => {
    dispatch(startPolling())
  }, [dispatch])

  let data = {
    solar: 0,
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
      solar: latest.pp,
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
          solarValue={data.solar}
          homeValue={data.homeUsage}
          storageValue={data.storage}
          gridValue={data.grid}
        />
      </section>
      <section>
        <h6 className="is-uppercase mt-20 mb-20">{t('ENERGY_GRAPH')}</h6>
        <EnergyGraph
          className="power-graph"
          series={['pp', 'pc', 'ps']}
          unitLabel="kW"
          hasStorage={true}
          power={true}
          data={liveData}
          weather={true}
          view={VIEWS.LIVE}
          animation={false}
        />
      </section>
      <section>
        <h6 className="is-uppercase mt-20 mb-20">{t('ENERGY_MIX')}</h6>
        <EnergyMix {...data} />
      </section>
    </section>
  )
}
