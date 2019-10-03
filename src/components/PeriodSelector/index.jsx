import React from 'react'
import { useI18n } from '../../shared/i18n'
import { useDispatch } from 'react-redux'
import { changeDatePeriod, INTERVAL_DELTA } from '../../state/actions/history'
import PeriodSelectorMenu from '../PeriodSelectorMenu'

import './PeriodSelector.scss'

function changeDatePeriodOption(dispatch) {
  return option => dispatch(changeDatePeriod(option.value))
}

function PeriodSelector({ intervalDelta }) {
  const t = useI18n()
  const dispatch = useDispatch()

  const options = [
    { id: 1, text: t('HISTORY_DAY_VIEW'), value: INTERVAL_DELTA.DAY },
    { id: 2, text: t('HISTORY_WEEK_VIEW'), value: INTERVAL_DELTA.WEEK },
    { id: 3, text: t('HISTORY_MONTH_VIEW'), value: INTERVAL_DELTA.MONTH },
    {
      id: 4,
      text: t('HISTORY_YEAR_VIEW'),
      value: INTERVAL_DELTA.YEAR,
      disabled: true
    },
    {
      id: 5,
      text: t('HISTORY_LIFETIME_VIEW'),
      value: INTERVAL_DELTA.LIFETIME,
      disabled: true
    },
    {
      id: 6,
      text: t('HISTORY_CUSTOM_DATES_VIEW'),
      value: INTERVAL_DELTA.CUSTOM,
      disabled: true
    }
  ]

  const selectedOpt = options.find(({ value }) => value === intervalDelta) || {}
  selectedOpt.selected = true

  return (
    <PeriodSelectorMenu
      header={t('HISTORY_TIMEFRAME_HEADER')}
      options={options}
      className="is-seven-eighths"
      onClick={changeDatePeriodOption(dispatch)}
      modalId="modal-change-timeframe"
    />
  )
}

export default PeriodSelector
