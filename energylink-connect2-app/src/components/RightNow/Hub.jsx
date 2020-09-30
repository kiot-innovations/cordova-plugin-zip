import React from 'react'
import { useI18n } from 'shared/i18n'

const hubProducing = '#56a662'
const hubConsuming = '#ca0e0e'
const hubStates = {
  CONSUMING: 'consuming',
  PRODUCING: 'producing'
}

function Hub({ status }) {
  const t = useI18n()
  const color = status === hubStates.PRODUCING ? hubProducing : hubConsuming
  const hubText = {
    CONSUMING: t('HUB_CONSUMING'),
    PRODUCING: t('HUB_PRODUCING')
  }
  const text =
    status === hubStates.PRODUCING ? hubText.PRODUCING : hubText.CONSUMING

  return (
    <svg
      width="88"
      height="88"
      viewBox="0 0 88 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="hub-square fade-in"
    >
      <rect
        x="1.72266"
        y="2.39648"
        width="83.2069"
        height="83.2069"
        rx="8.5"
        fill="#1C272F"
        stroke="#1C272F"
        strokeWidth="3"
      />
      <text x="6" y="65" fill="white" className="hub-state is-uppercase">
        {text}
      </text>
      <path
        d="M39.5526 47.5687C39.6229 47.5975 39.6958 47.6112 39.7687 47.6112C39.9377 47.6112 40.1017 47.5369 40.208 47.4013L50.8809 33.8191C51.0053 33.6603 51.0255 33.4479 50.9324 33.2704C50.839 33.0929 50.6492 32.9808 50.4413 32.9808H45.7526L47.4255 23.4044C47.4674 23.1665 47.3321 22.9315 47.0996 22.8367C46.8692 22.7411 46.5957 22.8096 46.4443 23.0041L35.772 36.5858C35.6469 36.7446 35.6273 36.957 35.7199 37.1345C35.8133 37.312 36.003 37.424 36.2109 37.424H40.8987L39.227 47.0011C39.1854 47.2392 39.3201 47.4743 39.5526 47.5687Z"
        fill={color}
      >
        <animate
          id="animation1"
          attributeName="opacity"
          from="0.25"
          to="1"
          dur="1s"
          begin="0s;animation2.end"
        />
        <animate
          id="animation2"
          attributeName="opacity"
          from="1"
          to="0.25"
          dur="1s"
          begin="animation1.end"
        />
      </path>
    </svg>
  )
}

export default Hub
