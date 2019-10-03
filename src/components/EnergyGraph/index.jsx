import React, { useState } from 'react'
import moment from 'moment'
import clsx from 'clsx'
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Legend,
  ComposedChart,
  Area,
  Bar,
  Tooltip,
  ReferenceLine,
  ReferenceArea,
  Label
} from 'recharts'
import { useI18n } from '../../shared/i18n'
import { roundDecimals } from '../../shared/rounding'
import * as Icons from './Icons'
import './energy-graph.scss'

const wheaterMap = {
  brokenclouds: <Icons.BrokenClouds />,
  clearsky: <Icons.ClearSky />,
  fewclouds: <Icons.FewClouds />,
  mist: <Icons.Mist />,
  moon: <Icons.Moon />,
  rain: <Icons.Rain />,
  scatteredclouds: <Icons.ScatteredClouds />,
  showerrain: <Icons.ShowerRain />,
  snow: <Icons.Snow />,
  storm: <Icons.Storm />
}

export const VIEWS = {
  LIVE: 'live',
  HOUR: 'hour',
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month'
}

const VIEW_OPTIONS = {
  [VIEWS.LIVE]: { X_LABEL: 'minute', DATAPOINTS: 11, X_INTERVAL: 1 },
  [VIEWS.HOUR]: { X_LABEL: 'minute', DATAPOINTS: 12, X_INTERVAL: 1 },
  [VIEWS.DAY]: { X_LABEL: 'hour', DATAPOINTS: 25, X_INTERVAL: 3 },
  [VIEWS.WEEK]: {
    X_LABEL: 'dayName',
    X_SUBLABEL: 'dayNumber',
    DATAPOINTS: 7,
    X_INTERVAL: 0
  },
  [VIEWS.MONTH]: {
    X_LABEL: 'dayName',
    X_SUBLABEL: 'dayNumber',
    DATAPOINTS: 30,
    X_INTERVAL: 3
  }
}

const renderWheaterTick = view => props => {
  const {
    payload: { value, index },
    x,
    y
  } = props
  return wheaterMap[value] && index !== VIEW_OPTIONS[view].DATAPOINTS - 1 ? (
    <svg x={-13} y={y}>
      <svg x={x}>{wheaterMap[value]}</svg>
    </svg>
  ) : null
}

const XTick = ({ view, data, width, height, x, y, payload }) => {
  const mainValue = data[payload.index][VIEW_OPTIONS[view].X_LABEL]
  const subValue = data[payload.index][VIEW_OPTIONS[view].X_SUBLABEL]
  return (
    <g>
      <text
        width={width}
        height={height * 2}
        x={x}
        y={y}
        stroke="none"
        fill="#F8F8F8"
        fontSize="10"
        textAnchor="middle"
      >
        <tspan x={x} dy="0.72em" fontWeight="bold">
          {mainValue.toUpperCase()}
        </tspan>
        {subValue && (
          <tspan x={x} dy="1.2em">
            {subValue}
          </tspan>
        )}
      </text>
    </g>
  )
}

const CustomLegend = props => {
  const { payload, onClick } = props

  const formatValue = value => {
    switch (value.trim()) {
      case 'pp':
        return 'Solar Production'
      case 'pc':
        return 'Home Usage'
      case 'ps':
        return 'From Storage'
      case 'p':
        return 'Solar Production'
      case 'c':
        return 'Home Usage'
      case 's':
        return 'From Storage'
      default:
        return ''
    }
  }
  return (
    <ul className="legend">
      {payload.map((entry, index) => {
        const isHidden = entry.value.includes(' ')
        const ish = clsx({ hidden: isHidden })
        return (
          <li
            className={ish}
            key={`item-${index}`}
            style={{ color: entry.color }}
            onClick={() => onClick(entry)}
          >
            {formatValue(entry.value)}
          </li>
        )
      })}
    </ul>
  )
}

export const formatData = (view, data = {}, weather) => {
  const dataPoints = VIEW_OPTIONS[view].DATAPOINTS

  data = Object.entries(data)
    .map(([k, v]) => {
      return {
        ...v,
        minute: moment(k).format('hh:mm'),
        hour: moment(k).format('hA'),
        dayName: moment(k).format('ddd'),
        dayNumber: moment(k).format('M/D'),
        date: k
      }
    })
    .filter(v => !!v.date)

  // Fill missing datapoints for the rest of the day
  if (data.length < dataPoints) {
    const missingPoints = dataPoints - data.length
    for (let i = 0; i < missingPoints; i++) {
      const lastPoint = data[data.length - 1]
      if (lastPoint) {
        let newDate = moment(lastPoint.date)
        if (view === VIEWS.HOUR) {
          newDate = newDate.add(15, 'minutes')
        } else if (view === VIEWS.DAY) {
          newDate = newDate.add(1, 'hour')
        } else if (view === VIEWS.WEEK) {
          newDate = newDate.add(1, 'day')
        } else if (view === VIEWS.MONTH) {
          newDate = newDate.add(1, 'day')
        } else if (view === VIEWS.LIVE) {
          newDate = newDate.add(5, 'minute')
        }

        data.push({
          minute: moment(newDate).format('hh:mm'),
          hour: moment(newDate).format('hA'),
          dayName: moment(newDate).format('ddd'),
          dayNumber: moment(newDate).format('M/D'),
          date: newDate.format('YYYY-MM-DDTHH:mm:ss'),
          pp: 0,
          pc: 0,
          ps: 0,
          p: 0,
          c: 0,
          s: 0
        })
      }
    }
  }

  return data
}

function EnergyGraph({
  view = VIEWS.DAY,
  power = false,
  hasStorage = false,
  isLoading = false,
  series = ['p', 'c', 's'],
  unitLabel = 'kWh',
  className,
  height = 380,
  weather = true,
  animation = true,
  data
}) {
  const t = useI18n()
  const viewOptions = VIEW_OPTIONS[view]
  const classes = clsx('energy-graph', className)
  const [visibleSeries, setVisibleSeries] = useState(series)

  // Needed to reset visibleSeries when we use another series
  // Otherwise with 2 graphs on the page it would only use the first series
  // (useState is set on first render only)
  if (visibleSeries[0].trim() !== series[0].trim()) {
    setVisibleSeries(series)
  }

  data = formatData(view, data, weather)

  let max = data.reduce(
    (acc, curr) =>
      Math.max(curr[series[0]], curr[series[1]], curr[series[2]], acc),
    0
  )

  max = max > 1 ? Math.ceil(max) : max

  const yInterval = (max > 1 ? Math.round : roundDecimals)(max / 3)
  const yInterval1 = 0 + yInterval
  const yInterval2 = yInterval1 + yInterval
  const yMargin = (max > 1 ? Math.round : roundDecimals)(max / 4)

  let min = hasStorage
    ? data.reduce(
        (acc, curr) =>
          Math.min(
            curr[series[0]],
            curr[series[1]],
            curr[series[2]],
            acc,
            -yMargin
          ),
        0
      )
    : 0

  min = min < -1 ? Math.floor(min) : min

  const SeriesCmp = power ? Area : Bar

  return (
    <div className="energy-graph-container">
      <ResponsiveContainer className={classes} width="100%" height={height}>
        <ComposedChart data={data} margin={{ left: 5, right: 10 }}>
          {weather && (
            <XAxis
              xAxisId={1}
              type="category"
              dataKey="weather"
              orientation="top"
              interval={viewOptions.X_INTERVAL}
              tickLine={false}
              axisLine={false}
              tick={renderWheaterTick(view)}
            />
          )}
          <ReferenceLine y={max} stroke="#607586" strokeWidth={1} />
          <ReferenceLine y={yInterval2} stroke="#607586" strokeWidth={1} />
          <ReferenceLine y={yInterval1} stroke="#607586" strokeWidth={1} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#213445',
              border: 0,
              borderRadius: 5
            }}
            labelFormatter={value =>
              `Status at ${data[value] &&
                data[value][VIEW_OPTIONS[view].X_LABEL]}`
            }
            cursor={{ fill: '#FFE600', fillOpacity: 0.2, strokeWidth: 2 }}
          />
          <SeriesCmp
            dataKey={visibleSeries[0]}
            barSize={10}
            fill="#FFE600"
            stroke="#FFE600"
            radius={[10, 10, 0, 0]}
            unit={` ${unitLabel}`}
            isAnimationActive={animation}
          />
          <SeriesCmp
            dataKey={visibleSeries[1]}
            barSize={10}
            fill="#C4C4C4"
            stroke="#C4C4C4"
            radius={[10, 10, 0, 0]}
            unit={` ${unitLabel}`}
            isAnimationActive={animation}
          />
          {hasStorage && (
            <SeriesCmp
              dataKey={visibleSeries[2]}
              barSize={10}
              fill="#F7921E"
              stroke="#F7921E"
              radius={[10, 10, 0, 0]}
              unit={` ${unitLabel}`}
              isAnimationActive={animation}
            />
          )}
          <XAxis
            id="wheather-axis"
            xAxisId={0}
            tick={<XTick view={view} data={data} />}
            interval={viewOptions.X_INTERVAL}
            tickLine={false}
            axisLine={false}
          >
            {hasStorage && (
              <Label
                style={{
                  fill: '#FFFFFF',
                  fontSize: 10
                }}
                value={t('BATTERY_CHARGING')}
                offset={-20}
                position="insideTop"
              />
            )}
          </XAxis>
          <YAxis
            width={25}
            axisLine={false}
            tickLine={false}
            tickMargin={10}
            interval={0}
            ticks={[min, 0, yInterval1, yInterval2, max]}
            tick={{ fill: '#F8F8F8', fontSize: 10, textAnchor: 'middle' }}
            tickFormatter={tick => {
              const unit = tick === min ? '' : `\n${unitLabel}`
              return `${tick}${unit}`
            }}
            domain={['dataMin', `dataMax + ${yMargin}`]}
          />
          <ReferenceArea
            y1={0}
            y2={min}
            ifOverflow="extendDomain"
            isFront={true}
            fill="#04070A"
            fillOpacity={0.3}
          />
          <ReferenceLine y={0} stroke="white" strokeWidth={2} isFront={true} />
          <Legend
            wrapperStyle={{
              paddingTop: '30px'
            }}
            content={CustomLegend}
            onClick={event => {
              // Adds a space at the end of the dataKey to hide it
              // https://github.com/recharts/recharts/issues/329
              const series = [...visibleSeries]
              const key = event.dataKey
              const index = series.indexOf(key)
              series[index] = series[index].includes(' ')
                ? series[index].trim()
                : `${series[index]} `
              return setVisibleSeries(series)
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
      {isLoading ? (
        <div className="energy-graph-loader mb-50 pb-100">
          <div>
            <span className="loader"></span>
            <span className="loader-label pl-15">
              {t('LOADING_GRAPH_DATA')}
            </span>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default EnergyGraph
