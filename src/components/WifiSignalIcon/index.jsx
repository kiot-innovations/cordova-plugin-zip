import React from 'react'

import './WifiSignalIcon.scss'

function WifiSignalIcon({ signalQuality }) {
  return (
    <svg
      className="wifi-icon"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        y="12"
        width="2"
        height="6"
        className={`${signalQuality >= 1 ? 'has' : 'no'}-signal`}
      />
      <rect
        x="4"
        y="9"
        width="2"
        height="9"
        className={`${signalQuality >= 2 ? 'has' : 'no'}-signal`}
      />
      <rect
        x="8"
        y="6"
        width="2"
        height="12"
        className={`${signalQuality >= 3 ? 'has' : 'no'}-signal`}
      />
      <rect
        x="12"
        y="3"
        width="2"
        height="15"
        className={`${signalQuality >= 4 ? 'has' : 'no'}-signal`}
      />
      <rect
        x="16"
        width="2"
        height="18"
        className={`${signalQuality >= 5 ? 'has' : 'no'}-signal`}
      />
    </svg>
  )
}

export default WifiSignalIcon
