import React from 'react'
import { Logo, LogoBlack } from './Icons'

import './SunPowerImage.scss'

function SunPowerImage({ inverse = false }) {
  return (
    <figure className="logo-container">
      {inverse ? <Logo /> : <LogoBlack />}
    </figure>
  )
}

export default SunPowerImage
