import React from 'react'
import { isEmpty, map, compose, pluck, sum, length } from 'ramda'
import { either } from 'shared/utils'
import { useI18n } from 'shared/i18n'
import { roundDecimals } from 'shared/rounding'

import './MiDataLive.scss'
import Collapsible from '../Collapsible'

function MiDataLive({ data }) {
  const t = useI18n()
  const inverterCount = length(data)
  const totalProduction = sum(pluck('power', data))
  const totalWatts = (totalProduction / 1000).toFixed(2)

  return (
    <div className="mt-10 mb-10">
      <Collapsible title={t('POWER_PRODUCTION')} actions={`${totalWatts} kW`}>
        <div className="mi-data-live">
          {either(
            isEmpty(data),
            renderEmpty(t),
            renderTable(t, data, inverterCount)
          )}
        </div>
      </Collapsible>
    </div>
  )
}

const renderEmpty = t => (
  <div className="auto pl-30 pr-30">
    <p className="has-text-centered empty is-size-4">{t('NO_MI_LIVE_DATA')}</p>
  </div>
)

const renderTable = (t, data, inverterCount) => (
  <div className="power-production">
    <div className="inverter-count">
      <span className="count-value has-text-weight-bold is-size-1">
        {inverterCount}
      </span>
      <span className="ml-10 has-text-weight-bold">
        {inverterCount === 1 ? t('INVERTER') : t('INVERTERS')}
      </span>
    </div>
    {renderData(t)(data)}
  </div>
)

const renderDataItem = t => value => (
  <div className="power-row mt-5 mb-5" key={value.sn}>
    <span className="has-text-white">{value.sn}</span>
    <span className="has-text-white has-text-weight-bold has-text-right">
      {roundDecimals(value.power)} {t('WATTS')}
    </span>
  </div>
)

// t -> [a] -> [DOM Node]
const renderData = compose(map, renderDataItem)

export default MiDataLive
