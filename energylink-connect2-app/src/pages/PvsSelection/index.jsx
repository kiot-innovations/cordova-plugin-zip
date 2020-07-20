import React from 'react'
import { compose, map, path, prop } from 'ramda'
import { useSelector } from 'react-redux'

const getPvsSerialNumbers = compose(
  map(prop('deviceSerialNumber')),
  path(['site', 'sitePVS'])
)
function PvsSelection() {
  const PVS = useSelector(getPvsSerialNumbers)
  return (
    <main className="full-height pl-10 pr-10 ">
      {PVS.map(elem => (
        <p key={elem}>{elem}</p>
      ))}
    </main>
  )
}

export default PvsSelection
