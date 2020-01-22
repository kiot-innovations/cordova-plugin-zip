import React from 'react'
import moment from 'moment'
import EnergyMixChart from './EnergyMixChart'
import { Battery, SolarPanel, Grid } from '../Icons'
import { useI18n } from '../../shared/i18n'
import './EnergyMix.scss'

export default function EnergyMix(props) {
  const {
    solar = 0,
    storage = 0,
    grid = 0,
    date = moment().startOf('hour'),
    homeUsage = 0
  } = props
  const t = useI18n()
  const time = moment(date).format('hh:mmA')
  const solarPercentage =
    solar !== 0
      ? (Math.min(solar, homeUsage) * 100) / Math.max(solar, homeUsage)
      : 0
  return (
    <div className="energy-mix-container columns  is-mobile is-multiline is-variable is-1">
      <div className="column is-8">
        <h6 className="title is-uppercase is-6">{t('TODAYS_ENERGY_MIX')}</h6>
        <h6 className="subtitle is-uppercase is-6">
          {t('AS_OF_TIME_TODAY', time)}
        </h6>
      </div>

      <div className="column is-full">
        <h6 className="percentage is-uppercase is-6 mb-10">
          {t('SOLAR')} <b>{solarPercentage.toFixed(2)}%</b>
        </h6>
        <EnergyMixChart {...props} />
      </div>
      <div className="column is-4 is-flex energy-source">
        <SolarPanel />
        <p className="is-uppercase energy-source-label solar mt-8">
          {t('FROM')} {t('SOLAR')}
        </p>
        <p className="energy-source-info yellow mt-5">
          {solar.toFixed(2)} <br /> {t('KWH')}
        </p>
      </div>
      <div className="column is-4 is-flex energy-source">
        <Battery />
        <p className="is-uppercase energy-source-label battery mt-8">
          {storage < 0 ? t('TO') : t('FROM')} {t('BATTERY')}
        </p>
        <p className="energy-source-info orange mt-5">
          {Math.abs(storage).toFixed(2)} <br /> {t('KWH')}
        </p>
      </div>
      <div className="column is-4 is-flex energy-source">
        <Grid />
        <p className="is-uppercase energy-source-label grid mt-8">
          {grid < 0 ? t('TO') : t('FROM')} {t('GRID')}
        </p>
        <p className="energy-source-info blue mt-5">
          {Math.abs(grid).toFixed(2)} <br /> {t('KWH')}
        </p>
      </div>
    </div>
  )
}
