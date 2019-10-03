import React from 'react'
import paths from '../../pages/Router/paths'
import { useI18n } from '../../shared/i18n'
import { Link } from 'react-router-dom'
import './RightNow.scss'
import SolarSquare from './SolarSquare'
import HomeSquare from './HomeSquare'
import Hub from './Hub'
import GridSquare from './GridSquare'
import StorageSquare from './StorageSquare'

const hubStates = {
  CONSUMING: 'consuming',
  PRODUCING: 'producing'
}

const arrowDirections = {
  UP: 'up',
  DOWN: 'down',
  LEFT: 'left',
  RIGHT: 'right'
}

function ArrowH(color, direction, value) {
  if (value < 0.1)
    return (
      <svg
        width="62"
        height="26"
        viewBox="0 0 33 63"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      />
    )
  return direction === arrowDirections.RIGHT ? (
    <svg
      width="62"
      height="25"
      viewBox="0 0 62 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M61.4328 14.8883C62.0186 14.3025 62.0186 13.3528 61.4328 12.767L51.8869 3.22104C51.3011 2.63525 50.3514 2.63525 49.7656 3.22104C49.1798 3.80682 49.1798 4.75657 49.7656 5.34236L58.2509 13.8276L49.7656 22.3129C49.1798 22.8987 49.1798 23.8485 49.7656 24.4342C50.3514 25.02 51.3011 25.02 51.8869 24.4342L61.4328 14.8883ZM0.0273437 15.3276L60.3722 15.3276V12.3276L0.0273438 12.3276L0.0273437 15.3276Z"
        fill={color}
      />
      <rect
        x="12.1113"
        y="2.89746"
        width="32.8966"
        height="21.4358"
        rx="1.5"
        fill={color}
        stroke={color}
      />
      <path
        d="M23.4122 20.2402L23.9318 19.5762L25.1544 18.248H26.4982L24.7638 20.1426L26.6037 22.6152H25.2287L23.9708 20.8457L23.4591 21.2559V22.6152H22.2677V16.5371H23.4591V19.248L23.3966 20.2402H23.4122ZM32.8849 22.6152H31.506L30.7326 19.6152C30.7039 19.5085 30.6544 19.2884 30.5841 18.9551C30.5164 18.6191 30.4773 18.3939 30.4669 18.2793C30.4513 18.4199 30.4122 18.6465 30.3497 18.959C30.2872 19.2689 30.2391 19.4902 30.2052 19.623L29.4357 22.6152H28.0607L26.6037 16.9043H27.7951L28.5255 20.0215C28.6531 20.597 28.7456 21.0957 28.8029 21.5176C28.8185 21.3691 28.8537 21.14 28.9083 20.8301C28.9656 20.5176 29.019 20.2754 29.0685 20.1035L29.9005 16.9043H31.0451L31.8771 20.1035C31.9135 20.2467 31.9591 20.4655 32.0138 20.7598C32.0685 21.054 32.1102 21.3066 32.1388 21.5176C32.1648 21.3145 32.2065 21.0618 32.2638 20.7598C32.3211 20.4551 32.3732 20.209 32.4201 20.0215L33.1466 16.9043H34.338L32.8849 22.6152Z"
        fill="#15202E"
      />
      <text
        x="46%"
        y="55%"
        textAnchor="middle"
        className="arrow-unit"
        fill="black"
      >
        {value}
      </text>
    </svg>
  ) : (
    <svg
      width="63"
      height="25"
      viewBox="0 0 63 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.969509 14.8883C0.383724 14.3025 0.383724 13.3528 0.969509 12.767L10.5155 3.22104C11.1012 2.63525 12.051 2.63525 12.6368 3.22104C13.2226 3.80682 13.2226 4.75657 12.6368 5.34236L4.15149 13.8276L12.6368 22.3129C13.2226 22.8987 13.2226 23.8485 12.6368 24.4342C12.051 25.02 11.1012 25.02 10.5155 24.4342L0.969509 14.8883ZM62.375 15.3276L2.03017 15.3276V12.3276L62.375 12.3276V15.3276Z"
        fill={color}
      />
      <rect
        x="20.1133"
        y="2.89746"
        width="32.8966"
        height="21.4358"
        rx="1.5"
        fill={color}
        stroke={color}
      />
      <path
        d="M31.4142 20.2402L31.9337 19.5762L33.1564 18.248H34.5001L32.7658 20.1426L34.6056 22.6152H33.2306L31.9728 20.8457L31.4611 21.2559V22.6152H30.2697V16.5371H31.4611V19.248L31.3986 20.2402H31.4142ZM40.8869 22.6152H39.5079L38.7345 19.6152C38.7059 19.5085 38.6564 19.2884 38.5861 18.9551C38.5184 18.6191 38.4793 18.3939 38.4689 18.2793C38.4533 18.4199 38.4142 18.6465 38.3517 18.959C38.2892 19.2689 38.241 19.4902 38.2072 19.623L37.4376 22.6152H36.0626L34.6056 16.9043H35.797L36.5275 20.0215C36.6551 20.597 36.7475 21.0957 36.8048 21.5176C36.8204 21.3691 36.8556 21.14 36.9103 20.8301C36.9676 20.5176 37.021 20.2754 37.0704 20.1035L37.9025 16.9043H39.047L39.879 20.1035C39.9155 20.2467 39.9611 20.4655 40.0158 20.7598C40.0704 21.054 40.1121 21.3066 40.1408 21.5176C40.1668 21.3145 40.2085 21.0618 40.2658 20.7598C40.3231 20.4551 40.3751 20.209 40.422 20.0215L41.1486 16.9043H42.34L40.8869 22.6152Z"
        fill="#15202E"
      />
      <text
        x="57%"
        y="55%"
        textAnchor="middle"
        className="arrow-unit"
        fill="black"
      >
        {value}
      </text>
    </svg>
  )
}

function ArrowV(color, direction, value) {
  if (value < 0.1)
    return (
      <svg
        width="33"
        height="63"
        viewBox="0 0 33 63"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      />
    )
  return direction === arrowDirections.UP ? (
    <svg
      width="33"
      height="63"
      viewBox="0 0 33 63"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.922 0.78883C17.3362 0.203045 16.3865 0.203045 15.8007 0.78883L6.25472 10.3348C5.66894 10.9206 5.66894 11.8703 6.25472 12.4561C6.84051 13.0419 7.79026 13.0419 8.37604 12.4561L16.8613 3.97081L25.3466 12.4561C25.9324 13.0419 26.8821 13.0419 27.4679 12.4561C28.0537 11.8703 28.0537 10.9206 27.4679 10.3348L17.922 0.78883ZM18.3613 62.1943L18.3613 1.84949L15.3613 1.84949L15.3613 62.1943L18.3613 62.1943Z"
        fill={color}
      />
      <rect
        x="0.482422"
        y="22.2585"
        width="32.8966"
        height="22.436"
        rx="2"
        fill={color}
      />
      <path
        d="M12.2833 40.1013L12.8029 39.4373L14.0255 38.1091H15.3693L13.6349 40.0037L15.4747 42.4763H14.0997L12.8419 40.7068L12.3302 41.1169V42.4763H11.1388V36.3982H12.3302V39.1091L12.2677 40.1013H12.2833ZM21.756 42.4763H20.3771L19.6037 39.4763C19.575 39.3695 19.5255 39.1495 19.4552 38.8162C19.3875 38.4802 19.3484 38.255 19.338 38.1404C19.3224 38.281 19.2833 38.5076 19.2208 38.8201C19.1583 39.13 19.1102 39.3513 19.0763 39.4841L18.3068 42.4763H16.9318L15.4747 36.7654H16.6662L17.3966 39.8826C17.5242 40.4581 17.6167 40.9568 17.674 41.3787C17.6896 41.2302 17.7247 41.0011 17.7794 40.6912C17.8367 40.3787 17.8901 40.1365 17.9396 39.9646L18.7716 36.7654H19.9162L20.7482 39.9646C20.7846 40.1078 20.8302 40.3266 20.8849 40.6208C20.9396 40.9151 20.9813 41.1677 21.0099 41.3787C21.0359 41.1755 21.0776 40.9229 21.1349 40.6208C21.1922 40.3162 21.2443 40.0701 21.2912 39.8826L22.0177 36.7654H23.2091L21.756 42.4763Z"
        fill="#15202E"
      />
      <text
        x="50%"
        y="55%"
        textAnchor="middle"
        className="arrow-unit"
        fill="black"
      >
        {value}
      </text>
    </svg>
  ) : (
    <svg
      width="33"
      height="63"
      viewBox="0 0 33 63"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.078 62.1833C16.6638 62.7691 17.6135 62.7691 18.1993 62.1833L27.7453 52.6374C28.3311 52.0516 28.3311 51.1019 27.7453 50.5161C27.1595 49.9303 26.2097 49.9303 25.624 50.5161L17.1387 59.0014L8.65339 50.5161C8.0676 49.9303 7.11785 49.9303 6.53207 50.5161C5.94628 51.1019 5.94628 52.0516 6.53207 52.6374L16.078 62.1833ZM15.6387 0.777832L15.6387 61.1227L18.6387 61.1227L18.6387 0.777832L15.6387 0.777832Z"
        fill={color}
      />
      <rect
        x="0.757812"
        y="21.1196"
        width="32.8966"
        height="22.4359"
        rx="2"
        fill={color}
      />
      <path
        d="M12.5587 38.9631L13.0783 38.2991L14.3009 36.9709H15.6447L13.9103 38.8655L15.7501 41.3381H14.3751L13.1173 39.5686L12.6056 39.9788V41.3381H11.4142V35.26H12.6056V37.9709L12.5431 38.9631H12.5587ZM22.0314 41.3381H20.6525L19.879 38.3381C19.8504 38.2314 19.8009 38.0113 19.7306 37.678C19.6629 37.342 19.6238 37.1168 19.6134 37.0022C19.5978 37.1428 19.5587 37.3694 19.4962 37.6819C19.4337 37.9918 19.3856 38.2131 19.3517 38.3459L18.5822 41.3381H17.2072L15.7501 35.6272H16.9415L17.672 38.7444C17.7996 39.3199 17.8921 39.8186 17.9494 40.2405C17.965 40.092 18.0001 39.8629 18.0548 39.553C18.1121 39.2405 18.1655 38.9983 18.215 38.8264L19.047 35.6272H20.1915L21.0236 38.8264C21.06 38.9696 21.1056 39.1884 21.1603 39.4827C21.215 39.7769 21.2566 40.0295 21.2853 40.2405C21.3113 40.0374 21.353 39.7847 21.4103 39.4827C21.4676 39.178 21.5197 38.9319 21.5665 38.7444L22.2931 35.6272H23.4845L22.0314 41.3381Z"
        fill="#15202E"
      />
      <text
        x="50%"
        y="53%"
        textAnchor="middle"
        className="arrow-unit"
        fill="black"
      >
        {value}
      </text>
    </svg>
  )
}

function RightNow({
  solarValue = 0,
  homeValue = 0,
  storageValue = 0,
  gridValue = 0,
  batteryLevel = 0,
  location
}) {
  const t = useI18n()
  const storageDirection =
    storageValue > 0 ? arrowDirections.LEFT : arrowDirections.RIGHT
  const gridDirection =
    gridValue > 0 ? arrowDirections.UP : arrowDirections.DOWN
  const hubState = gridValue > 0 ? hubStates.CONSUMING : hubStates.PRODUCING
  const windowWidth = window.innerWidth

  homeValue = homeValue > 0 ? 0 : Math.abs(homeValue).toFixed(0)
  solarValue = solarValue > 0 ? solarValue.toFixed(0) : 0
  gridValue = Math.abs(gridValue).toFixed(0)
  storageValue = Math.abs(storageValue).toFixed(0)
  batteryLevel = batteryLevel ? batteryLevel.toFixed(0) : batteryLevel

  const classes = windowWidth > 320 ? 'power-cycle' : 'power-cycle scale85'

  return (
    <div className="right-now mt-20 mb-20">
      <h1 className="is-uppercase mb-20">{t('RIGHT_NOW')}</h1>
      <div className={classes}>
        <div className="left-column">
          {SolarSquare()}
          {ArrowH('#ffe600', arrowDirections.RIGHT, solarValue)}
        </div>
        <div className="central-column">
          {HomeSquare()}
          {ArrowV('#838b98', arrowDirections.UP, homeValue)}
          {Hub(hubState)}
          {ArrowV('#2b93cc', gridDirection, gridValue)}
          {GridSquare()}
        </div>
        <div className="right-column">
          {ArrowH('#f7921e', storageDirection, storageValue)}
          <Link
            className="link"
            to={{
              pathname: paths.STORAGE,
              state: {
                from: location.pathname
              }
            }}
          >
            {StorageSquare(batteryLevel, location)}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default RightNow
