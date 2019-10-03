import React from 'react'
import moment from 'moment'
import { Chevron } from './Icons'
import { useI18n } from '../../shared/i18n'
import { usePrevious } from '../../shared/usePrevious'
import { INTERVAL_DELTA } from '../../state/actions/history'

import './DateIntervalPicker.scss'

const getDateInterval = (startDate, endDate, intervalDelta) => {
  endDate = moment(startDate).endOf(intervalDelta.toLowerCase())
  startDate = moment(startDate).startOf(intervalDelta.toLowerCase())
  if (endDate.isAfter(moment())) {
    endDate = moment()
  }

  if (startDate.isAfter(endDate)) {
    startDate = moment(endDate).startOf(intervalDelta.toLowerCase())
  }

  return [startDate, endDate]
}

const getNextInterval = ([startDate, endDate], intervalDelta) => {
  const newStartDate = moment(startDate).add(
    1,
    `${INTERVAL_DELTA[intervalDelta]}s`
  )
  return getDateInterval(newStartDate, endDate, intervalDelta)
}

const getPreviousInterval = ([startDate, endDate], intervalDelta) => {
  const newStartDate = moment(startDate).subtract(
    1,
    `${INTERVAL_DELTA[intervalDelta]}s`
  )
  return getDateInterval(newStartDate, endDate, intervalDelta)
}

const renderInterval = (t, interval, intervalDelta) => {
  const startDate = moment(interval[0])
  const endDate = moment(interval[1])
  switch (intervalDelta) {
    case INTERVAL_DELTA.YEAR:
      return `${startDate.format('YYYY')}`
    case INTERVAL_DELTA.MONTH:
      return `${startDate.format('MMMM, YYYY')}`
    case INTERVAL_DELTA.WEEK:
      return `${startDate.format('ddd, M/DD')} - ${endDate
        .endOf('week')
        .format('ddd, M/DD')}`
    case INTERVAL_DELTA.DAY:
    default:
      return `${startDate.format('dddd')} ${startDate.format('MMMM D, YYYY')}`
  }
}

const DateIntervalPicker = ({
  onChange = () => {},
  intervalDelta = INTERVAL_DELTA.DAY,
  interval = getDateInterval(moment().startOf('day'), null, INTERVAL_DELTA.DAY)
}) => {
  const t = useI18n()
  const prevDelta = usePrevious(intervalDelta)

  if (intervalDelta !== prevDelta) {
    onChange(getDateInterval(moment().startOf('day'), null, intervalDelta))
  }

  return (
    <div className="date-scroller">
      <Chevron
        onClick={() => onChange(getPreviousInterval(interval, intervalDelta))}
      />
      <h3 className="interval-text is-3 is-uppercase">
        {renderInterval(t, interval, intervalDelta)}
      </h3>
      <Chevron
        onClick={() => onChange(getNextInterval(interval, intervalDelta))}
      />
    </div>
  )
}

export default DateIntervalPicker
