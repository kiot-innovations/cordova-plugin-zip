import React from 'react'
import EnergyInfo from '../EnergyInfo'
import PoweringIcon from './PoweringIcon'

function BatteryStats(props) {
  const { title, text, data = [] } = props
  return (
    <section>
      <h6 className="is-uppercase is-size-7 has-text-centered">{title}</h6>
      <h6 className="is-uppercase has-text-weight-bold has-text-centered has-text-white">
        {text}
      </h6>

      <div className="container mt-20">
        {data.map(({ icon, ...more }, idx) => (
          <div className="mb-10" key={`${more.title}-${idx}`}>
            <EnergyInfo icon={icon || <PoweringIcon />} high={true} {...more} />
          </div>
        ))}
      </div>
    </section>
  )
}

export default BatteryStats
