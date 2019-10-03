import React from 'react'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'

import MainNavBar from '../../components/MainNavBar'
import SubNavBar from '../../components/SubNavBar'
import paths from '../Router/paths'
import { useI18n } from '../../shared/i18n'
import PeriodSelector from '../../components/PeriodSelector'
import DateIntervalPicker from '../../components/DateIntervalPicker'
import EnergyGraph, { VIEWS } from '../../components/EnergyGraph'
import { INTERVALS, getEnergyData } from '../../state/actions/energy-data'
import { CHANGE_INTERVAL, INTERVAL_DELTA } from '../../state/actions/history'
import LifetimeSavings from '../../components/LifetimeSavings'
import EnvironmentalSavings from '../../components/EnvironmentalSavings'
import SocialFooter from '../../components/SocialFooter'
import CustomIntervalPicker from '../../components/CustomIntervalPicker'
import { sliceData } from '../../shared/sliceData'

import './History.scss'

const DATA_GRAPH_LOOKUP = {
  [INTERVAL_DELTA.DAY]: {
    dataKey: INTERVALS.HOUR,
    view: VIEWS.DAY,
    span: 'day',
    unit: 'hour'
  },
  [INTERVAL_DELTA.WEEK]: {
    dataKey: INTERVALS.DAY,
    view: VIEWS.WEEK,
    span: 'week',
    unit: 'day'
  },
  [INTERVAL_DELTA.MONTH]: {
    dataKey: INTERVALS.DAY,
    view: VIEWS.MONTH,
    span: 'month',
    unit: 'day'
  },
  [INTERVAL_DELTA.YEAR]: {
    dataKey: INTERVALS.MONTH,
    view: VIEWS.YEAR,
    span: 'year',
    unit: 'month'
  }
}

const History = ({ location }) => {
  const t = useI18n()
  const dispatch = useDispatch()
  const interval = useSelector(state => state.history.interval)
  const intervalDelta = useSelector(state => state.history.intervalDelta)
  const {
    carbondioxide,
    carmiles,
    gasoline,
    coal,
    crudeoil,
    trees,
    garbage
  } = useSelector(state => state.environment.envImpact)

  const isGraphLoading = useSelector(state => {
    if (!state.history || !state.history.interval) {
      return false
    }

    const intervalDelta = state.history.intervalDelta
    const range = DATA_GRAPH_LOOKUP[intervalDelta] || { dataKey: 0 }
    return state.energyData.isLoading[range.dataKey]
  })

  const data = useSelector(
    state => {
      if (!state.history || !state.history.interval) {
        return {}
      }

      const intervalDelta = state.history.intervalDelta
      const [startDate, endDate] = state.history.interval
      const range = DATA_GRAPH_LOOKUP[intervalDelta] || { dataKey: 0 }
      const data =
        state.energyData[range.dataKey] && state.energyData[range.dataKey].data

      const span = range.span
      const unit = range.unit

      if (!data) {
        return {}
      }

      const slicedData = sliceData(data, startDate, endDate)

      // Calculate the expected point for this time span
      const expectedPoints = (moment(startDate)
        .endOf(span)
        .add(1, unit)
        .isAfter(moment())
        ? moment()
        : moment(startDate)
            .endOf(span)
            .add(1, unit)
      ).diff(moment(startDate), unit)

      const isLoading = state.energyData.isLoading[range.dataKey]

      // Fetch the interval again if there are missing points
      if (
        slicedData.endDateIx - slicedData.startDateIx < expectedPoints &&
        !isLoading
      ) {
        dispatch(
          getEnergyData(
            moment(startDate).valueOf(),
            moment(endDate).valueOf(),
            unit
          )
        )
      }

      return slicedData.data
    },
    (left, right) => {
      return (
        Object.keys(left).filter(i => Object.keys(right).indexOf(i) < 0)
          .length === 0
      )
    }
  )

  const range = DATA_GRAPH_LOOKUP[intervalDelta] || {}

  return (
    <section className="section app has-bar full-min-height">
      <MainNavBar location={location} />
      <SubNavBar
        tabs={[
          { title: t('TAB_TITLE_HOME'), url: paths.ROOT },
          { title: t('TAB_TITLE_STORAGE'), url: paths.STORAGE },
          { title: t('TAB_TITLE_HISTORY'), active: true, url: paths.HISTORY }
        ]}
      />
      <div className="container mt-20">
        <PeriodSelector intervalDelta={intervalDelta} />
        {intervalDelta !== 'CUSTOM' ? (
          <DateIntervalPicker
            interval={interval}
            intervalDelta={intervalDelta}
            onChange={interval => dispatch(CHANGE_INTERVAL({ interval }))}
          />
        ) : (
          <div className="mt-30 is-flex file level is-centered">
            <CustomIntervalPicker
              onChange={interval => {
                if (interval[0] && interval[1]) {
                  dispatch(CHANGE_INTERVAL({ interval }))
                }
              }}
            />
          </div>
        )}
        <div className="history-graph container mt-20">
          <EnergyGraph
            hasStorage={true}
            isLoading={isGraphLoading}
            data={isGraphLoading ? {} : data}
            weather={true}
            view={range.view}
          />
        </div>
        <div className="separator" />
        <LifetimeSavings value={1000} />
        <div className="separator" />
        <EnvironmentalSavings
          co2={carbondioxide}
          driven={carmiles}
          coal={coal}
          oil={crudeoil}
          gas={gasoline}
          trees={trees}
          garbage={garbage}
        />
        <div className="separator" />
        <SocialFooter invert={true} />
      </div>
    </section>
  )
}

export default History
