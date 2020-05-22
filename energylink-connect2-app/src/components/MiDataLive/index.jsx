import React from 'react'
import { isEmpty, map, compose } from 'ramda'
import { either } from 'shared/utils'
import { useI18n } from 'shared/i18n'

import './MiDataLive.scss'

function MiDataLive({ data }) {
  const t = useI18n()

  return (
    <div className="mi-data-live">
      {either(isEmpty(data), renderEmpty(t), renderTable(t, data))}
    </div>
  )
}

const renderEmpty = t => (
  <div className="auto pl-30 pr-30">
    <p className="has-text-centered empty is-size-4">{t('NO_MI_LIVE_DATA')}</p>
  </div>
)

const renderTable = (t, data) => (
  <table className="auto mb-50">
    <thead>
      <tr>
        <th className="is-uppercase has-text-white is-size-7 has-text-centered">
          {t('MI_SN')}
        </th>

        <th className="is-uppercase has-text-white is-size-7 has-text-centered">
          {t('POWER_OUTPUT')}
        </th>
      </tr>
    </thead>
    <tbody>{renderData(t)(data)}</tbody>
  </table>
)

const renderDataItem = t => value => (
  <tr key={value.sn}>
    <td className="pl-10 pt-10 pb-10 pr-10 has-text-white has-text-centered">
      {value.sn}
    </td>
    <td className="pt-10 has-text-white has-text-centered">
      {value.power} {t('WATTS')}
    </td>
  </tr>
)

// t -> [a] -> [DOM Node]
const renderData = compose(map, renderDataItem)

export default MiDataLive
