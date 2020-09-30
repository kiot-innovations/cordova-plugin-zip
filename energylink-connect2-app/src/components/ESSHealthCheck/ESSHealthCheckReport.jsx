import React from 'react'
import clsx from 'clsx'
import moment from 'moment'
import { map, keys, propOr, pathOr, is, isEmpty } from 'ramda'
import { useI18n } from 'shared/i18n'
import { either } from 'shared/utils'

function ESSHealthCheckReport({ report }) {
  const t = useI18n()

  return (
    <>
      {either(
        !isEmpty(report.ess_state),
        <section>
          <h6 className="has-text-white has-text-weight-bold mb-10">
            {t('SUNVAULT_STATE')}
          </h6>
          {map(renderItem, report.ess_state)}
        </section>,
        missingReport(t, 'SUNVAULT_STATE')
      )}

      {either(
        !isEmpty(report.battery_status),
        <section>
          <h6 className="has-text-white has-text-weight-bold mb-10 mt-10">
            {t('BATTERIES')}
          </h6>
          {map(renderItem, report.battery_status)}
        </section>,
        missingReport(t, 'BATTERIES')
      )}

      {either(
        !isEmpty(report.inverter_status),
        <section>
          <h6 className="has-text-white has-text-weight-bold mb-10">
            {t('INVERTERS')}
          </h6>
          {map(renderItem, report.inverter_status)}
        </section>,
        missingReport(t, 'INVERTERS')
      )}

      {either(
        !isEmpty(report.hub_plus_status),
        <section>
          <h6 className="has-text-white has-text-weight-bold mb-10">
            {t('HUB_PLUS')}
          </h6>
          {renderItem(report.hub_plus_status)}
        </section>,
        missingReport(t, 'HUB_PLUS')
      )}

      {either(
        !isEmpty(report.ess_status),
        <section>
          <h6 className="has-text-white has-text-weight-bold mb-10">
            {t('ALL_IN_ONE')}
          </h6>
          {map(renderItem, report.ess_status)}
        </section>,
        missingReport(t, 'ALL_IN_ONE')
      )}
    </>
  )
}

const renderItem = item => (
  <ESSHealthCheckReportItem key={item.serial_number || 'NO_SN'} {...item} />
)

const missingReport = (t, deviceName) => (
  <div className="hc-missing-report has-text-centered is-flex mb-10 mt-10 pt-10 pb-10">
    <span className="has-text-weight-bold has-text-white">
      {t('MISSING_HC_REPORT', t(deviceName))}
    </span>
  </div>
)

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
        {t(serial_number)}
      </p>
      <p>
        <span className="has-text-weight-bold mr-5">{t('LAST_UPDATED')}:</span>
        {moment(last_updated).format('MM/DD/YYYY hh:mm A')}
      </p>

      {map(renderRestValues(t, rest), keys(rest))}
    </div>
  )
}

const generateMeterObject = (meter, name) => {
  return {
    [`meter_${name}_current`]: pathOr('', ['reading', 'current'], meter),
    [`meter_${name}_power`]: pathOr('', ['reading', 'power'], meter),
    [`meter_${name}_voltage`]: pathOr('', ['reading', 'voltage'], meter)
  }
}

const renderEssMeterReading = meterData => {
  const meterReadingObject = {
    serial_number: 'METER_READINGS',
    last_updated: pathOr('', ['last_updated'], meterData),
    ...(meterData.meter_a && generateMeterObject(meterData.meter_a, 'a')),
    ...(meterData.meter_b && generateMeterObject(meterData.meter_b, 'b'))
  }
  return renderItem(meterReadingObject)
}

const renderRestValues = (t, rest) => key => {
  if (key === 'ess_meter_reading') {
    return rest[key]
      ? renderEssMeterReading(rest[key])
      : missingReport(t, 'METER_READINGS')
  } else {
    const keyValue = propOr(rest[key], 'value', rest[key])

    return (
      <p key={key}>
        <span className="mr-5 has-text-weight-bold">{t(key)}:</span>
        <span className="mr-5 is-capitalized">
          {is(Number, keyValue)
            ? parseFloat(keyValue).toFixed(2)
            : keyValue.toString()}
        </span>
        {propOr('', 'unit', rest[key])}
      </p>
    )
  }
}

export default ESSHealthCheckReport
