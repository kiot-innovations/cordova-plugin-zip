import React from 'react'
import './Data.scss'
import RightNow from '../../components/RightNow'
import EnergyMix from '../../components/EnergyMix'
import { useI18n } from '../../shared/i18n'

export default () => {
  const t = useI18n()

  return (
  <section className="data is-flex has-text-centered full-height">
    <section>
    <h6 className="is-uppercase mt-20 mb-20">{t('RIGHT_NOW')}</h6>
    <RightNow />
    </section>
    <section>
      <h6 className="is-uppercase mt-20 mb-20">{t('ENERGY_MIX')}</h6>
      <EnergyMix />
    </section>
  </section>
)}
