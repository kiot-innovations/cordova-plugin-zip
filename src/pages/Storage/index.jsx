import React from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import MainNavBar from '../../components/MainNavBar'
import SubNavBar from '../../components/SubNavBar'
import Battery from '../../components/Battery'
import BatteryMode from '../../components/BatteryMode'
import BatteryStatus from '../../components/BatteryStatus'
import SocialFooter from '../../components/SocialFooter'
import BatteryStats from '../../components/BatteryStats'
import paths from '../Router/paths'
import { useI18n } from '../../shared/i18n'
import { OPERATION_MODES } from '../../state/actions/storage'
import { INTERVALS } from '../../state/actions/energy-data'

import './Storage.scss'
import BackupAmount from '../../components/BackupAmount'
import BatterySystemStatus from '../../components/BatterySystemStatus'

const OPERATION_LABELS = {
  [OPERATION_MODES.STORAGE_BACKUP_ONLY]: 'BACKUP_ONLY',
  [OPERATION_MODES.STORAGE_COST_SAVING]: 'COST_SAVINGS',
  [OPERATION_MODES.STORAGE_SOLAR_SELF_SUPPLY]: 'SOLAR_SELF_SUPPLY'
}

/**
 * TODO: Remove after SPI
 * Fake data from https://us.sunpower.com/sites/default/files/equinox-storage-product-brochure.pdf
 */
const RATED_ENERGY_CAPACITY = 13

const selectEnergyData = state => {
  if (
    state.energyData[INTERVALS.HOUR] &&
    state.energyData[INTERVALS.HOUR].data
  ) {
    const entries = Object.entries(state.energyData[INTERVALS.HOUR].data)

    if (!entries.length) {
      return {}
    }

    const [latestDate, latest] = entries[entries.length - 1]
    return {
      date: latestDate,
      stateOfCharge: latest.soc || 0
    }
  }

  return {}
}

function Storage({ location }) {
  const t = useI18n()
  const { selectedMode } = useSelector(state => state.storage)
  const energyData = useSelector(selectEnergyData, shallowEqual)

  const batteryMode = t('POWERING_HOME')

  const bsTitle = t('OUTAGE_LIST')
  const bsText = t('OUTAGE_POWER')
  const dataBatteryStats = [
    {
      title: 'Jul, 7/6/19',
      text: '8:26am',
      when: '3h 21m',
      value: '5.7',
      unit: 'kWh',
      color: 'primary'
    },
    {
      title: 'Jul, 7/23/19',
      text: '2:54pm',
      when: '16h 3m',
      value: '43.2',
      unit: 'kWh',
      color: 'primary'
    },
    {
      title: 'Aug, 8/11/19',
      text: '7:03am',
      when: '4h 7m',
      value: '3.0',
      unit: 'kWh',
      color: 'primary'
    },
    {
      title: 'Aug, 8/17/19',
      text: '10:42pm',
      when: '8h 32m',
      value: '23.2',
      unit: 'kWh',
      color: 'primary'
    }
  ]

  return (
    <section className="section storage has-bar full-min-height pr-0 pl-0">
      <MainNavBar location={location} />
      <SubNavBar
        tabs={[
          { title: t('TAB_TITLE_HOME'), url: paths.ROOT },
          { title: t('TAB_TITLE_STORAGE'), active: true, url: paths.STORAGE },
          { title: t('TAB_TITLE_HISTORY'), url: paths.HISTORY }
        ]}
      />
      <div className="sub-section container display-battery-storage mt-20 pb-30 is-flex">
        <BatteryMode mode={t(OPERATION_LABELS[selectedMode])} />
        <Battery
          energyPercetage={
            energyData.stateOfCharge ? energyData.stateOfCharge * 100 : 100
          }
          kwCharged={
            energyData.stateOfCharge
              ? (RATED_ENERGY_CAPACITY * energyData.stateOfCharge).toFixed(2)
              : RATED_ENERGY_CAPACITY
          }
          className="mt-20"
        />
        <BatteryStatus mode={batteryMode} className="mt-40" />
      </div>
      <div className="separator is-dotted is-gray mt-5 mb-5" />
      <div className="sub-section mt-40 mb-50">
        <BackupAmount />
      </div>
      <div className="separator" />
      <BatterySystemStatus internet={true} offgrid={true} warning={true} />
      <div className="separator" />
      <div className="sub-section mt-40 mb-50">
        <BatteryStats title={bsTitle} text={bsText} data={dataBatteryStats} />
      </div>
      <div className="separator" />
      <div className="sub-section">
        <SocialFooter invert={true} />
      </div>
    </section>
  )
}

export default Storage
