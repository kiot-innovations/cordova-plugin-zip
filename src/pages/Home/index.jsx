import React, { useEffect } from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import moment from 'moment'
import { fetchLTEData } from '../../state/actions/environment'
import { useI18n } from '../../shared/i18n'
import { INTERVALS } from '../../state/actions/energy-data'
import paths from '../Router/paths'
import MainNavBar from '../../components/MainNavBar'
import SubNavBar from '../../components/SubNavBar'
import ReferAFriend from '../../components/ReferAFriend'
import LifetimeSavings from '../../components/LifetimeSavings'
import SocialFooter from '../../components/SocialFooter'
import EnvironmentalSavings from '../../components/EnvironmentalSavings'
import EnergyMix from '../../components/EnergyMix'
import EnergyInfoGroup from '../../components/EnergyInfoGroup'
import { HomeWhite, SolarPanel, Grid, Battery } from '../../components/Icons'
import RightNow from '../../components/RightNow'
import EnergyGraphSection from './EnergyGraphSection'

import './Home.scss'

const selectEnergyData = interval => state => {
  if (state.energyData[interval] && state.energyData[interval].data) {
    const entries = Object.entries(state.energyData[interval].data)

    if (!entries.length) {
      return {}
    }

    const [latestDate, latest] = entries[entries.length - 1]
    return {
      date: latestDate,
      stateOfCharge: latest.soc,
      solar: latest.p,
      storage: latest.s,
      homeUsage: latest.c,
      grid: latest.c - latest.p - latest.s,
      powerSolar: latest.pp,
      powerStorage: latest.ps,
      powerHomeUsage: latest.pc,
      powerGrid: latest.pc - latest.pp - latest.ps
    }
  }

  return {}
}

const accumulatedDailyData = state => {
  if (
    state.energyData[INTERVALS.HOUR] &&
    state.energyData[INTERVALS.HOUR].data
  ) {
    const dates = Object.keys(state.energyData[INTERVALS.HOUR].data)

    if (!dates.length) {
      return {}
    }

    const firstPointIx = dates.findIndex(
      v => moment(v).format('YYYYMMDD') === moment().format('YYYYMMDD')
    )

    const todaysData = Object.entries(
      state.energyData[INTERVALS.HOUR].data
    ).slice(firstPointIx)

    const [latestDate] = todaysData[todaysData.length - 1]

    return todaysData.reduce(
      (acc, [_, values]) => {
        return {
          ...acc,
          solar: acc.solar + values.p,
          storage: acc.storage + values.s,
          homeUsage: acc.homeUsage + values.c,
          grid: acc.grid + (values.c - values.p - values.s),
          powerSolar: acc.powerSolar + values.pp,
          powerStorage: acc.powerStorage + values.ps,
          powerHomeUsage: acc.powerHomeUsage + values.pc,
          powerGrid: acc.powerGrid + (values.pc - values.pp - values.ps)
        }
      },
      {
        date: latestDate,
        stateOfCharge: 1,
        solar: 0,
        storage: 0,
        homeUsage: 0,
        grid: 0,
        powerSolar: 0,
        powerStorage: 0,
        powerHomeUsage: 0,
        powerGrid: 0
      }
    )
  }
  return {}
}

const selectEnvImpact = state => state.environment.envImpact

function Home({ location }) {
  const t = useI18n()
  const dispatch = useDispatch()

  const energyData = useSelector(selectEnergyData(INTERVALS.HOUR), shallowEqual)
  const dailyEnergyData = useSelector(accumulatedDailyData, shallowEqual)
  const {
    carbondioxide,
    carmiles,
    gasoline,
    coal,
    crudeoil,
    trees,
    garbage
  } = useSelector(selectEnvImpact, shallowEqual)

  useEffect(() => {
    dispatch(fetchLTEData())
  }, [dispatch])

  const home = {
    title: t('TAB_TITLE_HOME'),
    text: t('CONSUMPTION'),
    when: t('TODAY'),
    value: dailyEnergyData.homeUsage,
    unit: t('KWH'),
    color: 'white',
    icon: <HomeWhite />
  }

  const solar = {
    title: t('SOLAR'),
    text: t('PRODUCTION'),
    when: t('today'),
    value: dailyEnergyData.solar,
    unit: t('KWH'),
    color: 'warning',
    icon: <SolarPanel />
  }

  const grid = {
    title: t('GRID'),
    text: t('USAGE'),
    when: t('TODAY'),
    value: dailyEnergyData.grid,
    unit: t('KWH'),
    color: 'info',
    icon: <Grid />
  }

  const battery = {
    title: t('BATTERY'),
    text: t('CHARGED'),
    when: t('today'),
    value: dailyEnergyData.storage,
    unit: t('KWH'),
    color: 'primary',
    icon: <Battery />
  }

  const energyInfoData = [home, solar, grid, battery]

  return (
    <section className="section home has-bar full-min-height">
      <MainNavBar location={location} />
      <SubNavBar
        tabs={[
          { title: t('TAB_TITLE_HOME'), active: true, url: paths.ROOT },
          { title: t('TAB_TITLE_STORAGE'), url: paths.STORAGE },
          { title: t('TAB_TITLE_HISTORY'), url: paths.HISTORY }
        ]}
      />
      <div className="container mt-20">
        <div className="mb-50">
          <RightNow
            solarValue={energyData.powerSolar}
            gridValue={energyData.powerGrid}
            storageValue={energyData.powerStorage}
            homeValue={-(energyData.powerHomeUsage || 0)}
            batteryLevel={
              energyData.stateOfCharge ? energyData.stateOfCharge * 100 : null
            }
            location={location}
          />
        </div>
        <div className="separator" />
        <EnergyMix {...dailyEnergyData} />
        <div className="separator" />
        <EnergyGraphSection />
        <div className="separator" />
        <EnergyInfoGroup
          title={t('SELF_RELIANT')}
          percent={80}
          data={energyInfoData}
        />
        <div className="separator" />
        <div className="sub-section">
          <ReferAFriend />
        </div>
        <div className="separator" />
        <div className="sub-section">
          <LifetimeSavings value={1000} />
        </div>
        <div className="separator" />
        <div className="sub-section">
          <EnvironmentalSavings
            co2={carbondioxide}
            driven={carmiles}
            coal={coal}
            oil={crudeoil}
            gas={gasoline}
            trees={trees}
            garbage={garbage}
          />
        </div>
        <div className="separator" />
        <div className="pl-15 pr-15">
          <SocialFooter invert={true} />
        </div>
      </div>
    </section>
  )
}

export default Home
