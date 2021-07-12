import React from 'react'
import { PieChart, Pie, Cell, Label } from 'recharts'

import { useI18n } from '../../shared/i18n'
import { Home } from '../Icons'

const COLORS = ['#2B93CC', '#F7921E', '#FFE600']

const renderHome = props => {
  const {
    t,
    homeUsage,
    viewBox: { cx, cy }
  } = props

  return (
    <svg
      className="home-usage-label"
      width={140}
      height={140}
      x={cx - 70}
      y={cy - 50}
    >
      <Home x={39} />
      <text
        x={70}
        y={65}
        textAnchor="middle"
        fill="#FFFFFF"
        className="home-usage-label-title is-uppercase"
      >
        {t('HOME_USAGE')}
      </text>
      <text x={70} y={85} textAnchor="middle" className="home-usage-label-info">
        {homeUsage} {t('KWH')}
      </text>
    </svg>
  )
}
export default function EnergyMix({
  storage = 0,
  grid = 0,
  solar = 0,
  homeUsage = 0,
  isAnimated = true
}) {
  const t = useI18n()
  const chartData = [
    { value: grid < 0 ? 0 : grid },
    { value: storage < 0 ? 0 : storage },
    { value: solar }
  ]

  return (
    <PieChart className="energy-mix-chart" width={195} height={195}>
      <Pie
        data={chartData}
        innerRadius={83}
        outerRadius={95}
        dataKey="value"
        blendStroke={true}
        startAngle={-180}
        endAngle={360}
        isAnimationActive={isAnimated}
      >
        {chartData.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={COLORS[index % COLORS.length]}
            filter="url(#filter0_i)"
          />
        ))}
        <Label
          offset={0}
          position="center"
          t={t}
          homeUsage={homeUsage.toFixed(2)}
          content={renderHome}
        />
      </Pie>
      <defs>
        <filter
          id="filter0_i"
          x="0.5"
          y="0.807617"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow" />
        </filter>
      </defs>
    </PieChart>
  )
}
