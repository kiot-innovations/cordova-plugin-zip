import React from 'react'
import clsx from 'clsx'
import './EnergySwitch.scss'

function EnergySwitch({ entries = [], onChange = () => {} }) {
  if (entries.length > 2) {
    console.warn('Only 2 entries supported for the EnergySwitch component')
  }

  const selectedIx = entries.findIndex(({ selected }) => selected)
  const classes = clsx('selected-label', `selected-${selectedIx}`)

  return (
    <div className="energy-switch is-flex">
      <div className={classes}></div>
      <div className="entries is-flex pt-8 pb-8">
        {entries.map(({ id, value, selected }) => (
          <div
            className={clsx(id.toLowerCase(), selected ? 'selected' : '')}
            key={value}
            onClick={() => onChange(id)}
          >
            {value}
          </div>
        ))}
      </div>
    </div>
  )
}

export default EnergySwitch
