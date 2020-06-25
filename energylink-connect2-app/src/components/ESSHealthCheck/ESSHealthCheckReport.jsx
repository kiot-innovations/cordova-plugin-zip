import React from 'react'
import { map, keys, propOr } from 'ramda'
import moment from 'moment'
import clsx from 'clsx'
import { useI18n } from 'shared/i18n'

function ESSHealthCheckReport({ report }) {
  const t = useI18n()

  return (
    <>
      <section>
        <h6 className="has-text-white has-text-weight-bold mb-10 mt-10">
          {t('BATTERIES')}
        </h6>
        {map(renderItem, report.battery_status)}
      </section>

      <section>
        <h6 className="has-text-white has-text-weight-bold mb-10">
          {t('INVERTERS')}
        </h6>
        {map(renderItem, report.inverter_status)}
      </section>

      <section>
        <h6 className="has-text-white has-text-weight-bold mb-10">
          {t('HUB_PLUS')}
        </h6>
        {renderItem(report.hub_plus_status)}
      </section>

      <section>
        <h6 className="has-text-white has-text-weight-bold mb-10">
          {t('ALL_IN_ONE')}
        </h6>
        {map(renderItem, report.ess_status)}
      </section>
    </>
  )
}

const renderItem = item => <ESSHealthCheckReportItem {...item} />

function ESSHealthCheckReportItem({
  serial_number,
  last_updated,
  hasError,
  ...rest
}) {
  const t = useI18n()
  const icon = clsx('is-size-5', {
    'sp-hey has-text-primary': hasError,
    'sp-check has-text-white': !hasError
  })

  return (
    <div className="collapsible mb-10">
      <i className={icon} />
      <p className="has-text-white has-text-weight-bold mb-10">
        {serial_number}
      </p>
      <p>
        <span className="has-text-weight-bold mr-5">{t('LAST_UPDATED')}:</span>
        {moment(last_updated).format('MM/DD/YYYY hh:mm A')}
      </p>

      {map(renderRestValues(t, rest), keys(rest))}
    </div>
  )
}

const renderRestValues = (t, rest) => key => (
  <p>
    <span className="mr-5 has-text-weight-bold">{t(key)}:</span>
    <span className="mr-5">{propOr(rest[key], 'value', rest[key])}</span>
    {propOr('', 'unit', rest[key])}
  </p>
)

export default ESSHealthCheckReport
