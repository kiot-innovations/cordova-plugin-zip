import React from 'react'
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

function ArrowH({ color, direction, value, enabled = true }) {
  if (!enabled) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="63"
        height="25"
        fill="none"
        viewBox="0 0 63 25"
        className="arrow fade-in"
      >
        <path stroke="#1c272f" strokeWidth="3" d="M0 12.5L63 12.5" />
        <rect
          width="31.897"
          height="22.436"
          x="16"
          y="1.87"
          fill="#1c272f"
          rx="2"
        />
        <text
          x="51%"
          y="67%"
          textAnchor="middle"
          className="arrow-na"
          fill="#828282"
        >
          N/A
        </text>
      </svg>
    )
  }

  if (value < 0.01) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="63"
        height="25"
        fill="none"
        viewBox="0 0 63 25"
        className="arrow fade-in"
      >
        <path stroke={color} strokeWidth="3" d="M0 12.5L63 12.5" />
        <rect
          width="31.897"
          height="22.436"
          x="16"
          y="1.87"
          fill={color}
          rx="2"
        />
        <path
          fill="#15202E"
          d="M27.801 19.712l.52-.664 1.223-1.328h1.343l-1.734 1.895 1.84 2.472h-1.375l-1.258-1.77-.512.411v1.36h-1.191v-6.079h1.191v2.711l-.062.992h.015zm9.473 2.375h-1.379l-.773-3a15.838 15.838 0 01-.149-.66 7.9 7.9 0 01-.117-.675 8.98 8.98 0 01-.117.68c-.063.309-.11.53-.145.663l-.77 2.992H32.45l-1.457-5.71h1.191l.73 3.117c.128.575.22 1.074.278 1.496a11.113 11.113 0 01.266-1.414l.832-3.2h1.144l.832 3.2c.037.143.082.362.137.656.055.294.096.547.125.758.026-.203.068-.456.125-.758.057-.305.11-.55.156-.738l.727-3.117h1.191l-1.453 5.71zM35.441 10.003c0 1.745-.287 3.037-.861 3.876-.57.838-1.45 1.258-2.639 1.258-1.153 0-2.023-.433-2.611-1.3-.583-.865-.875-2.143-.875-3.834 0-1.764.285-3.063.854-3.897.57-.838 1.447-1.257 2.632-1.257 1.153 0 2.024.437 2.612 1.312.592.875.888 2.156.888 3.842zm-4.888 0c0 1.226.105 2.105.315 2.639.214.528.572.793 1.073.793.492 0 .848-.27 1.067-.807.218-.538.328-1.413.328-2.625 0-1.226-.112-2.106-.335-2.639-.219-.537-.572-.806-1.06-.806-.497 0-.852.269-1.066.806-.214.533-.322 1.413-.322 2.639z"
        />
      </svg>
    )
  }

  return direction === arrowDirections.RIGHT ? (
    <svg
      width="62"
      height="25"
      viewBox="0 0 62 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="arrow fade-in"
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
      <text
        x="46%"
        y="90%"
        textAnchor="middle"
        className="arrow-unit"
        fill="black"
      >
        {'kW'}
      </text>
      <text
        x="46%"
        y="55%"
        textAnchor="middle"
        className="arrow-value"
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
      className="arrow fade-in"
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
      <text
        x="57%"
        y="90%"
        textAnchor="middle"
        className="arrow-unit"
        fill="black"
      >
        {'kW'}
      </text>
      <text
        x="57%"
        y="55%"
        textAnchor="middle"
        className="arrow-value"
        fill="black"
      >
        {value}
      </text>
    </svg>
  )
}

function ArrowV({ color, direction, value }) {
  if (value < 0.01) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="33"
        height="65"
        fill="none"
        viewBox="0 0 33 65"
        className="arrow fade-in"
      >
        <path stroke={color} strokeWidth="3" d="M16.861 64.404L17.004 1" />
        <rect
          width="31.897"
          height="22.436"
          x="0.482"
          y="24.468"
          fill={color}
          rx="2"
        />
        <path
          fill="#15202E"
          d="M12.284 42.31l.52-.663 1.223-1.328h1.343l-1.734 1.894 1.84 2.473H14.1l-1.258-1.77-.512.41v1.36H11.14v-6.078h1.191v2.71l-.062.993h.015zm9.473 2.376h-1.379l-.773-3a15.838 15.838 0 01-.149-.66 7.9 7.9 0 01-.117-.676 8.98 8.98 0 01-.117.68c-.063.31-.11.53-.145.664l-.77 2.992h-1.374l-1.457-5.711h1.191l.73 3.117c.128.576.22 1.074.278 1.496a11.113 11.113 0 01.266-1.414l.832-3.2h1.144l.832 3.2c.037.143.082.362.137.656.055.295.096.547.125.758.026-.203.068-.456.125-.758.057-.304.11-.55.156-.738l.727-3.117h1.191l-1.453 5.71zM19.924 32.601c0 1.746-.287 3.038-.861 3.876-.57.839-1.45 1.258-2.639 1.258-1.153 0-2.023-.433-2.611-1.299-.584-.866-.875-2.144-.875-3.835 0-1.763.285-3.062.854-3.896.57-.839 1.447-1.258 2.632-1.258 1.153 0 2.024.438 2.611 1.313.593.874.89 2.155.89 3.841zm-4.888 0c0 1.226.105 2.106.315 2.639.214.529.572.793 1.073.793.492 0 .848-.269 1.067-.807.218-.537.328-1.412.328-2.625 0-1.226-.112-2.105-.335-2.638-.22-.538-.572-.807-1.06-.807-.497 0-.852.269-1.066.807-.215.533-.322 1.412-.322 2.638z"
        />
      </svg>
    )
  }

  return direction === arrowDirections.UP ? (
    <svg
      width="33"
      height="63"
      viewBox="0 0 33 63"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="arrow fade-in"
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
      <text
        x="50%"
        y="67%"
        textAnchor="middle"
        className="arrow-unit"
        fill="black"
      >
        {'kW'}
      </text>
      <text
        x="50%"
        y="55%"
        textAnchor="middle"
        className="arrow-value"
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
      className="arrow fade-in"
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
      <text
        x="50%"
        y="66%"
        textAnchor="middle"
        className="arrow-unit"
        fill="black"
      >
        {'kW'}
      </text>
      <text
        x="50%"
        y="53%"
        textAnchor="middle"
        className="arrow-value"
        fill="black"
      >
        {value}
      </text>
    </svg>
  )
}

function RightNow({
  solarAvailable,
  solarValue = 0,
  homeValue = 0,
  hasStorage = false,
  storageValue = 0,
  gridValue = 0,
  batteryLevel = 0
}) {
  const storageDirection =
    storageValue > 0 ? arrowDirections.LEFT : arrowDirections.RIGHT
  const gridDirection =
    gridValue > 0 ? arrowDirections.UP : arrowDirections.DOWN
  const hubState = gridValue > 0 ? hubStates.CONSUMING : hubStates.PRODUCING
  const windowWidth = window.innerWidth

  homeValue = Math.abs(homeValue).toFixed(2)
  solarValue = Math.abs(solarValue).toFixed(2)
  gridValue = Math.abs(gridValue).toFixed(2)
  storageValue = Math.abs(storageValue).toFixed(2)
  batteryLevel = batteryLevel ? batteryLevel.toFixed(0) : batteryLevel

  const classes = windowWidth > 320 ? 'power-cycle' : 'power-cycle scale85'
  return (
    <div className="right-now mt-20 mb-20">
      <div className={classes}>
        <div className="left-column">
          <SolarSquare />
          <ArrowH
            color="#ffe600"
            direction={arrowDirections.RIGHT}
            value={solarValue}
            enabled={!!solarAvailable}
          />
        </div>
        <div className="central-column">
          <HomeSquare />
          <ArrowV
            color="#838b98"
            direction={arrowDirections.UP}
            value={homeValue}
          />
          <Hub status={hubState} />
          <ArrowV value={gridValue} direction={gridDirection} color="#2b93cc" />
          <GridSquare />
        </div>
        <div className="right-column">
          <ArrowH
            color="#f7921e"
            direction={storageDirection}
            value={storageValue}
            enabled={hasStorage}
          />
          <StorageSquare batteryLevel={batteryLevel} hasStorage={hasStorage} />
        </div>
      </div>
    </div>
  )
}

export default RightNow
