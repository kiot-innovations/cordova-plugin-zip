import React from 'react'

import './EnergyInfo.scss'

function EnergyInfo(props) {
  const {
    title,
    text,
    high,
    color = 'white',
    value = 0,
    unit,
    when,
    icon
  } = props
  const unitColor = `has-text-${color} is-size-4`
  const unitClassess = `info mt-20 ${unitColor}`
  const primary = high ? 'has-text-primary has-text-weight-bold' : ''
  const whenClass = `${!high ? 'is-uppercase ' : ''}has-text-centered is-size-7`
  return (
    <section className="energy-info pl-20 pt-10 pr-10 pb-15 has-background-dark">
      <article className="columns is-flex">
        <div className="column">
          <span className="is-size-7 has-text-white">
            <strong className="has-text-white mr-5">{title}</strong>
            <span className={primary}>{text}</span>
          </span>
          <div className={unitClassess}>
            <span className="is-size-3 mr-5 has-text-weight-light">
              {parseFloat(value).toFixed(2)}
            </span>
            <span className={unitColor}>{unit}</span>
          </div>
        </div>

        <div className="column has-text-centered is-flex level tile is-vertical pr-0">
          <div className={whenClass}>{when}</div>
          <div>{icon}</div>
        </div>
      </article>
    </section>
  )
}

export default EnergyInfo
