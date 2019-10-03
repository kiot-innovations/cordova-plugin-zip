import React from 'react'
import EnergyInfo from '../EnergyInfo'

function EnergyInfoGroup(props) {
  const { data } = props

  return (
    <section>
      {data.map((d, idx) => (
        <div className="mb-10" key={`${d.title}-${idx}`}>
          <EnergyInfo {...d} />
        </div>
      ))}
    </section>
  )
}

export default EnergyInfoGroup
