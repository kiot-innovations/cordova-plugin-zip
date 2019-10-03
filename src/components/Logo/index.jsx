import React from 'react'
import SunPowerImage from '../SunPowerImage'
import './Logo.scss'

function Logo() {
  return (
    <div className="Logo container">
      <div className="columns is-centered">
        <div className="column is-half">
          <SunPowerImage />
        </div>
      </div>
    </div>
  )
}

export default Logo
