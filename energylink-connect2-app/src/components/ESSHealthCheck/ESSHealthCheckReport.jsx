import React from 'react'
import { map, keys, propOr } from 'ramda'
import moment from 'moment'
import clsx from 'clsx'

function ESSHealthCheckReport({ report }) {
  return (
    <>
      <section>
        <h6 className="has-text-white has-text-weight-bold mb-10 mt-10">
          Batteries
        </h6>
        {map(renderItem, report.battery_status)}
      </section>

      <section>
        <h6 className="has-text-white has-text-weight-bold mb-10">Inverters</h6>
        {map(renderItem, report.inverter_status)}
      </section>

      <section>
        <h6 className="has-text-white has-text-weight-bold mb-10">Hub Plus</h6>
        {renderItem(report.hub_plus_status)}
      </section>

      <section>
        <h6 className="has-text-white has-text-weight-bold mb-10">
          All In One
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
      <p>Last updated: {moment(last_updated).format('MM/DD/YYYY hh:mm A')}</p>

      {map(renderRestValues(rest), keys(rest))}
    </div>
  )
}

const renderRestValues = rest => key => (
  <p>
    <span className="mr-5">{key}:</span>
    {propOr(rest[key], 'value', rest[key])}
    {propOr('', 'unit', rest[key])}
  </p>
)

export default ESSHealthCheckReport
